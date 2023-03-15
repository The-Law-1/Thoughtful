import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId, Types } from "mongoose";
import { MyFireStoreService } from "src/firebase/firebase.service";
import { Thought } from "src/types/thought";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Note } from "../types/note"; 
import { FieldValue } from "firebase-admin/firestore";

@Injectable()
export class NoteService {
    notesDocRef = null;

    constructor(private firebaseService: MyFireStoreService) {
        this.notesDocRef = firebaseService.db.collection('notes');
    }

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const res = await this.notesDocRef.add(
            createNoteDto
        );

        return new Note(res.id, createNoteDto.title, createNoteDto.thoughts);
    }

    async FindAll(): Promise<Note[]> {
        const snapshot = await this.notesDocRef.get();
        const notes = [] as Note[];

        snapshot.forEach(doc => {
            const note = doc.data() as Note;
            note.id = doc.id;
            notes.push(note);
        });

        return notes;
    }

    // ! this is bad I know, cf thoughts service
    async FindAllByTitle(title: string): Promise<Note[]> {
        const notesDoc = await this.notesDocRef.get();

        if (notesDoc.empty) {
            return [];
        }

        const filteredNotes = notesDoc.docs.filter(doc => doc.data().title.includes(title));

        return filteredNotes.map(doc => new Note(doc.id, doc.data().title, doc.data().thoughts));        
    }

    // get
    async GetOne(id: string): Promise<Note> {
        const doc = await this.notesDocRef.doc(id).get();

        return new Note(doc.id, doc.data().title, doc.data().thoughts);
    }

    // delete one
    async DeleteOne(id: string): Promise<Note> {
        const doc = await this.notesDocRef.doc(id).get();
        const note = new Note(doc.id, doc.data().title, doc.data().thoughts);

        let res = await this.notesDocRef.doc(id).delete();

        if (res === null)
            return null;

        return note;
    }

    // // // update one
    // // async UpdateOne(id: mongoose.Types.ObjectId, title: string): Promise<Note> {

    // //     let noteToUpdate = await this.noteModel.findById(id).exec();

    // //     // even if it's the same, no harm done
    // //     noteToUpdate.title = title;

    // //     return await noteToUpdate.save();
    // // }

    async RemoveThought(noteId:string, thoughtId: string): Promise<Note> {

        const noteRef = this.notesDocRef.doc(noteId);

        if (!noteRef.exists)
            return null;

        const removeRes = await noteRef.update({
            thoughts: FieldValue.arrayRemove(thoughtId)
        });

        if (removeRes === null)
            return null;

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.title, note.thoughts);
    }

    async FindOneByThoughtId(thoughtId: string): Promise<Note> {
        const notesDoc = await this.notesDocRef.where("thoughts", "array-contains", thoughtId).get();

        if (notesDoc.empty) {
            return null;
        }
        return new Note(notesDoc.docs[0].id, notesDoc.docs[0].data().title, notesDoc.docs[0].data().thoughts);
    }

    async RenameNote(id: string, newName: string): Promise<Note> {

        const noteRef = this.notesDocRef.doc(id);

        if (!noteRef.exists)
            return null;

        const renameRes = await noteRef.update({
            title: newName
        });

        if (renameRes === null)
            return null;

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.title, note.thoughts);
    }

    async AddThought(id: string, thoughtId: string): Promise<Note> {
        // get the note by id
        const noteRef = this.notesDocRef.doc(id);

        if (!noteRef.exists)
            return null;

        // Atomically add a new region to the "regions" array field.
        const unionRes = await noteRef.update({
            thoughts: FieldValue.arrayUnion(thoughtId)
        });

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.title, note.thoughts);
    }
}