import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
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

        const filteredNotes = notesDoc.docs.filter(doc => doc.data().title.toLowerCase().includes(title.toLowerCase()));

        return filteredNotes.map(doc => new Note(doc.id, doc.data().title, doc.data().thoughts));        
    }

    // get
    async GetOne(id: string): Promise<Note> {
        const doc = await this.firebaseService.db.collection("notes").doc(id).get();

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

    async RemoveThought(noteId:string, thoughtId: string): Promise<Note> {
        const noteRef = await this.firebaseService.db.collection('notes').doc(noteId);

        if (!noteRef)
            return null;

        const removeRes = await noteRef.update({
            thoughts: FieldValue.arrayRemove(thoughtId)
        });

        if (removeRes === null)
            return null;

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.data().title, note.data().thoughts);
    }

    async FindOneByThoughtId(thoughtId: string): Promise<Note> {
        const notesDoc = await this.notesDocRef.where("thoughts", "array-contains", thoughtId).get();

        if (notesDoc.empty) {
            return null;
        }
        return new Note(notesDoc.docs[0].id, notesDoc.docs[0].data().title, notesDoc.docs[0].data().thoughts);
    }

    async RenameNote(id: string, newName: string): Promise<Note> {
        const noteRef = this.firebaseService.db.collection('notes').doc(id);

        if (!noteRef)
            throw new BadRequestException("Note not found");

        const renameRes = await noteRef.update({
            title: newName
        });

        if (renameRes === null)
            throw new BadRequestException("Could not update note");

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.data().title, note.data().thoughts);
    }

    async AddThought(id: string, thoughtId: string): Promise<Note> {
        const noteRef = this.firebaseService.db.collection('notes').doc(id);

        if (!noteRef) {
            console.log("Note not found");
            return null;
        }

        const unionRes = await noteRef.update({
            thoughts: FieldValue.arrayUnion(thoughtId)
        });

        if (unionRes === null) {
            console.log("Unable to update");
            return null;
        }

        // get updated note
        const note = await noteRef.get();

        return new Note(note.id, note.data().title, note.data().thoughts);
    }
}