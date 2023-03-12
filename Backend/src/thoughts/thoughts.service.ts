import mongoose, { Model, Types } from "mongoose";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Thought, ThoughtDocument } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";
import { NoteService } from "src/notes/note.service";
import { Note, NoteDocument } from "src/notes/schemas/note.schema";
import { UpdateThoughtDto } from "./dto/update-thought.dto";
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class ThoughtsService {

    iv = randomBytes(16);
    encryptionPassword = 'Password used to generate key';
    key = null as Buffer;

    constructor(
        @InjectModel(Thought.name)
        private thoughtModel: Model<ThoughtDocument>, private noteService: NoteService) {

            this.encryptionPassword = process.env.ENCRYPTION_PASSWORD;

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

        const createdThought = new this.thoughtModel(createThoughtDto);

        // if the noteId is not a valid ObjectId, create a new note
        if (!Types.ObjectId.isValid(createThoughtDto.noteId)) {
            // create a new note
            const newNote = await this.noteService.create({title: "Untitled", thoughts: [] });
            // add the noteId to the thought
            createdThought.noteId = newNote._id;

            await this.noteService.AddThought(newNote._id, createdThought._id.toString());

        } else {
            // find the note by the noteId
            const note = await this.noteService.GetOne(createThoughtDto.noteId);
            // add the thought to the note
            // note.thoughts.push(createdThought._id);

            createdThought.noteId = note._id;

            await this.noteService.AddThought(note._id, createdThought._id.toString());
            // save the note
            // await this.noteService.UpdateOne(note._id, {title: note.title, thoughts: note.thoughts.map(x =>  x.toString())});
        }

        createdThought.save();

        return createdThought;
    }

    async addThoughtToNote(noteTitle: string, createThoughtDto: CreateThoughtDto): Promise<Thought> {
        const createdThought = new this.thoughtModel(createThoughtDto);

        // check if note exists
        const notes = await this.noteService.FindAllByTitle(noteTitle);
        if (notes.length > 0) {
            let noteToChange = notes[0];
            // add the thought to the note

            this.noteService.AddThought(noteToChange._id, createdThought._id.toString());
        } else {

            // create a new note
            const newNote = await this.noteService.create({title: noteTitle, thoughts: [] });
            // add the noteId to the thought
            createdThought.noteId = newNote._id;

            await this.noteService.AddThought(newNote._id, createdThought._id.toString());
        }
        createdThought.save();

        return createdThought;
    }

    async FindThoughtsForNoteId(id: mongoose.Types.ObjectId): Promise<Thought[]> {

        let thoughts = await this.thoughtModel.find({ noteId: id}).exec();
        // decrypt content
        for (let i = 0; i < thoughts.length; i++) {
            const thought = thoughts[i];
            thought.content = this.decrypt(thought.content);
        }
        return thoughts;
    }


    // I hardly see a use for this but you never know
    async FindAll(): Promise<Thought[]> {
        return this.thoughtModel.find().exec();
    }

    // filter by content
    async FindAllByContent(content: string): Promise<Thought[]> {

        // ?? encrypt the content ?? works, but case-sensitive
        content = this.encrypt(content);

        console.log("content ", content);
        // this is a regex search
        // https://docs.mongodb.com/manual/reference/operator/query/regex/
        let thoughts = await this.thoughtModel.find({content: {$regex: content, $options: "i"}}).exec();

        // decrypt the content
        for (let i = 0; i < thoughts.length; i++) {
            const thought = thoughts[i];
            thought.content = this.decrypt(thought.content);
        }

        return thoughts;
    }

    // get
    async GetOne(id: string): Promise<Thought> {
        let thought = await this.thoughtModel.findById(id).exec();

        if (!thought) {
            return null;
        }

        thought.content = this.decrypt(thought.content);

        return thought;
    }

    async UpdateMultiple(thoughts: UpdateThoughtDto[]): Promise<Thought[]> {

        // * encrypt the content in updateThoughtDto array
        for (let i = 0; i < thoughts.length; i++) {
            const thought = thoughts[i];
            thought.content = this.encrypt(thought.content);
        }

        return await Promise.all(thoughts.map(thought => this.UpdateOne(thought._id.toString(), { _id: new Types.ObjectId(thought._id), content: thought.content, noteId: thought.noteId })));
    }

    async DeleteAllWithNoteId(noteId: string): Promise<any> {
        const deleteResult = await this.thoughtModel.deleteMany({noteId: noteId}).exec();

        // IDK how to check if the delete was successful
        return deleteResult;
    }

    // update
    async UpdateOne(id: string, thought: Thought): Promise<Thought> {
        let thoughtToUpdate = await this.thoughtModel.findById(id).exec();

        // * encrypt the content in thought
        thought.content = this.encrypt(thought.content);

        if (thoughtToUpdate === null) {
            return await this.create(thought);
        }

        thoughtToUpdate.content = thought.content;
        thoughtToUpdate.noteId = thought.noteId;

        return await thoughtToUpdate.save();
    }

    // delete one
    async DeleteOne(id: string): Promise<Thought> {

        const thought = await this.thoughtModel.findByIdAndRemove({_id: id}).exec();

        if (thought === null)
            throw new BadRequestException("Thought not found");

        let updatedNote = await this.noteService.RemoveThought(thought.noteId, id);
        if (updatedNote === null)
            throw new BadRequestException("Note not found");

        return thought;
    }

}