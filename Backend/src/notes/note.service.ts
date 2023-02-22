import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Thought } from "src/types/thought";
import { CreateNoteDto } from "./dto/create-note.dto";
import { Note, NoteDocument } from "./schemas/note.schema";

@Injectable()
export class NoteService {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const createdNote = new this.noteModel(createNoteDto);

        let note = await createdNote.save();
        // does the id port automatically?
        // note._id = createdNote._id;

        return note;
    }

    async FindAll(): Promise<Note[]> {
        return this.noteModel.find().exec();
    }

    // find note by title
    async FindAllByTitle(title: string): Promise<Note[]> {
        return this.noteModel.find({title: {$regex: title, $options: "i"}}).exec();
    }

    // get
    async GetOne(id: string): Promise<Note> {
        return this.noteModel.findById(id).exec();
    }

    // delete one
    async DeleteOne(id: string): Promise<Note> {
        return await this.noteModel.findByIdAndRemove(id).exec();
    }

    // update one
    async UpdateOne(id: mongoose.Types.ObjectId, createNoteDto: CreateNoteDto): Promise<Note> {
        // * option new: true returns the updated document
        let updatedNote = this.noteModel.findByIdAndUpdate(id, createNoteDto, {new: true}).exec();

        return updatedNote;
    }

    async RenameNote(id: mongoose.Types.ObjectId, newName: string): Promise<Note> {
        let noteToUpdate = await this.noteModel.findById(id).exec();

        noteToUpdate.title = newName;

        let updatedNote = await noteToUpdate.save();

        return updatedNote;
    }

    async AddThought(id: mongoose.Types.ObjectId, thought: Thought): Promise<Note> {
        let noteToUpdate = await this.noteModel.findById(id).exec();

        noteToUpdate.thoughts.push(thought);

        let updatedNote = await noteToUpdate.save();

        return updatedNote;
    }
}