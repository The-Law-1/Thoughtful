import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateNoteDto } from "./dto/create-note.dto";
import { Note, NoteDocument } from "./schemas/note.schema";

@Injectable()
export class NotesService {
    constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

    async create(createNoteDto: CreateNoteDto): Promise<Note> {
        const createdNote = new this.noteModel(createNoteDto);

        return createdNote.save();
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
    async UpdateOne(id: string, createNoteDto: CreateNoteDto): Promise<Note> {
        // * option new: true returns the updated document
        let updatedNote = this.noteModel.findByIdAndUpdate(id, createNoteDto, {new: true}).exec();

        return updatedNote;
    }
}