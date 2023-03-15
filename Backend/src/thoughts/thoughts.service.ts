import mongoose, { Model, Types } from "mongoose";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
// import { Thought, ThoughtDocument } from "./schemas/thought.schema";
import { Thought} from "../types/thought";
import { CreateThoughtDto } from "./dto/create-thought.dto";
import { NoteService } from "src/notes/note.service";
import { Note, NoteDocument } from "src/notes/schemas/note.schema";
import { UpdateThoughtDto } from "./dto/update-thought.dto";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';
import { getFirestore } from "firebase-admin/firestore";
import { MyFireStoreService } from "src/firebase/firebase.service";

@Injectable()
export class ThoughtsService {

    iv = randomBytes(16);
    encryptionPassword = 'Password used to generate key';
    key = null as Buffer;

    thoughtsDocRef = null;
    notesDocRef = null;

    constructor(
        private noteService: NoteService, private firebaseService: MyFireStoreService) {

            this.encryptionPassword = process.env.ENCRYPTION_PASSWORD;

            this.thoughtsDocRef = firebaseService.db.collection('thoughts');
            this.notesDocRef = firebaseService.db.collection('notes');

            this.initEncryption();
        }

    async initEncryption() {
        this.key = (await promisify(scrypt)(this.encryptionPassword, 'salt', 32)) as Buffer;
    }

    decrypt(textToDecrypt: string): string {
        // const decipher = createDecipheriv('aes-256-cbc', this.key, this.iv);
        const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);
        const decryptedText = Buffer.concat([
            decipher.update(Buffer.from(textToDecrypt, 'hex')),
            decipher.final(),
        ]);

        return decryptedText.toString();
    }

    encrypt(textToEncrypt: string): string {
        // const cipher = createCipheriv('aes-256-cbc', this.key, this.iv);
        // let encrypted = cipher.update(content, 'utf8', 'hex');
        // encrypted += cipher.final('hex');
        // return encrypted;
        const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);
        const encryptedText = Buffer.concat([
          cipher.update(textToEncrypt),
          cipher.final(),
        ]);

        return encryptedText.toString('hex');
    }

    async create(createThoughtDto: CreateThoughtDto): Promise<Thought> {

        // * encrypt the content in createThoughtDto
        createThoughtDto.content = this.encrypt(createThoughtDto.content);

        const noteDoc = await this.notesDocRef.doc(createThoughtDto.noteId).get();

        if (!noteDoc.exists) {
            // create note
            const newNote = await this.noteService.create({title: "Untitled", thoughts: [] });
            
            createThoughtDto.noteId = newNote.id;
        }

        // * create the thought
        const res = await this.thoughtsDocRef.add(
            createThoughtDto
        );

        // add thought to note
        await this.noteService.AddThought(createThoughtDto.noteId, res.id);

        const createdThought = new Thought(res.id, createThoughtDto.content, createThoughtDto.noteId);

        return createdThought;
    }

    async addThoughtToNote(noteTitle: string, createThoughtDto: CreateThoughtDto): Promise<Thought> {

        // find note by title
        const noteDoc = await this.notesDocRef.where("title", "==", noteTitle).get();

        let noteId = null;

        if (noteDoc.empty) {
            // create note
            const newNote = await this.noteService.create({title: noteTitle, thoughts: [] });
            noteId = newNote.id;
        } else {
            noteId = noteDoc.docs[0].id;
        }

        createThoughtDto.noteId = noteId;
        // create thought
        const createdThought = await this.create(createThoughtDto);

        // add thought to note
        await this.noteService.AddThought(noteId, createdThought.id);

        return createdThought;
    }

    async FindThoughtsForNoteId(noteId: string): Promise<Thought[]> {
            
        const thoughtsDoc = await this.thoughtsDocRef.where("noteId", "==", noteId).get();

        if (thoughtsDoc.empty) {
            return [];
        }

        let thoughts = [];

        for (const doc of thoughtsDoc.docs) {
            const thought = new Thought(doc.id, this.decrypt(doc.data().content), doc.data().noteId);
            thoughts.push(thought);
        }

        return thoughts;
    }


    // I hardly see a use for this but you never know
    async FindAll(): Promise<Thought[]> {
        const thoughtsDoc = await this.thoughtsDocRef.get();

        if (thoughtsDoc.empty) {
            return [];
        }
        return thoughtsDoc.docs.map(doc => new Thought(doc.id, this.decrypt(doc.data().content), doc.data().noteId));
    }

    // filter by content
    async FindAllByContent(content: string): Promise<Thought[]> {

        // ?? encrypt the content ?? works, but case-sensitive
        content = this.encrypt(content);

        // fetch all the thoughts
        const thoughtsDoc = await this.thoughtsDocRef.get();

        if (thoughtsDoc.empty) {
            return [];
        }

        // ! ok so this is really bad but firebase doesn't support string filter (yet) but we're gonna try to keep our data small
        // filter by content containing filter
        const filteredThoughts = thoughtsDoc.docs.filter(doc => doc.data().content.includes(content));

        // ! this is also ugly
        return filteredThoughts.map(doc => new Thought(doc.id, this.decrypt(doc.data().content), doc.data().noteId));
    }

    // get
    async GetOne(id: string): Promise<Thought> {
        const thoughtDoc = await this.thoughtsDocRef.doc(id).get();

        if (thoughtDoc.empty) {
            return null;
        }

        let thought = new Thought(thoughtDoc.id, this.decrypt(thoughtDoc.data().content), thoughtDoc.data().noteId);

        return thought;
    }

    async UpdateMultiple(thoughts: UpdateThoughtDto[]): Promise<Thought[]> {

        // * encrypt the content in updateThoughtDto array
        for (let i = 0; i < thoughts.length; i++) {
            const thought = thoughts[i];
            thought.content = this.encrypt(thought.content);
        }

        const batch = this.firebaseService.db.batch();
        thoughts.forEach(thought => {
            const thoughtDoc = this.thoughtsDocRef.doc(thought.id);
            batch.update(thoughtDoc, { content: thought.content, noteId: thought.noteId });
        });

        let res = await batch.commit();

        // i think typescript is smart enough to convert two overlapping types to the return type
        return res !== null ? thoughts : null;
    }

    async DeleteAllWithNoteId(noteId: string): Promise<boolean> {
        // * delete all thoughts with noteId
        const thoughtsDoc = await this.thoughtsDocRef.where("noteId", "==", noteId).get();

        if (thoughtsDoc.empty) {
            return null;
        }

        const batch = this.firebaseService.db.batch();
        thoughtsDoc.forEach(doc => {
            batch.delete(doc.ref);
        });
        let res = await batch.commit();

        return res !== null ? true : false;
    }

    // update
    async UpdateOne(id: string, thought: UpdateThoughtDto): Promise<Thought> {
        const thoughtRef = await this.thoughtsDocRef.doc(id);

        if (thoughtRef.empty)
            return null;
        // * encrypt the content in updateThoughtDto
        thought.content = this.encrypt(thought.content);

        thoughtRef.update({ content: thought.content, noteId: thought.noteId });

        return new Thought(id, thought.content, thought.noteId);
    }

    // delete one
    async DeleteOne(id: string): Promise<boolean> {
        const res = await this.thoughtsDocRef.doc(id).delete();

        // delete it in the note
        const deleteFromNoteRes = await this.noteService.RemoveThought(res.data().noteId, id);

        return (res !== null && deleteFromNoteRes !== null) ? true : null;

    }

}