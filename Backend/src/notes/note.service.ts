import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model, ObjectId, Types } from "mongoose";
import { Thought } from "src/types/thought";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
import { Note, NoteDocument } from "./schemas/note.schema";
import { ThoughtsService } from "src/thoughts/thoughts.service";

@Injectable()
export class NoteService {
    constructor(
        @InjectModel(Note.name)
        private noteModel: Model<NoteDocument>, private thoughtService: ThoughtsService ) {}

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
    async UpdateOne(id: mongoose.Types.ObjectId, title: string, newThoughts: ObjectId[], deletedThoughts: string[]): Promise<Note> {

        // * thoughtsToUpdate also contains new thoughts
        // update/create thoughts
        // put the ids of the new thoughts into the note
        let noteToUpdate = await this.noteModel.findById(id).exec();

        // even if it's the same, no harm done
        noteToUpdate.title = title;

        // add new thoughts to note thoughts
        noteToUpdate.thoughts.push.apply(newThoughts);

        // ! this is also pretty rough but lets hope you're not deleting 100 thoughts at once
        // remove deleted thoughts from note thoughts
        noteToUpdate.thoughts = noteToUpdate.thoughts.filter(thought => !deletedThoughts.includes(thought.toString()));

        return await noteToUpdate.save();
        // * option new: true returns the updated document
        // let updatedNote = this.noteModel.findByIdAndUpdate(id, createNoteDto, {new: true}).exec();
        // return await this.noteModel.findById(id).exec();
    }

    async FindOneByThoughtId(thoughtId: string): Promise<NoteDocument> {
        // does this work?
        return this.noteModel.findOne({"thoughts._id": new mongoose.Types.ObjectId(thoughtId)}).exec();
    }

    async RenameNote(id: mongoose.Types.ObjectId, newName: string): Promise<Note> {
        let noteToUpdate = await this.noteModel.findById(id).exec();

        noteToUpdate.title = newName;

        let updatedNote = await noteToUpdate.save();

        return updatedNote;
    }

    async AddThought(id: mongoose.Types.ObjectId, thoughtId: string): Promise<Note> {
        let noteToUpdate = await this.noteModel.findById(id).exec();

        noteToUpdate.thoughts.push(new mongoose.Types.ObjectId(thoughtId));

        let updatedNote = await noteToUpdate.save();

        return updatedNote;
    }
}