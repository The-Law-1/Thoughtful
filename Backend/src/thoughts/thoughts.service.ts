import mongoose, { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Thought, ThoughtDocument } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";
import { NoteService } from "src/notes/note.service";
import { NoteDocument } from "src/notes/schemas/note.schema";

@Injectable()
export class ThoughtsService {
    constructor(@InjectModel(Thought.name) private thoughtModel: Model<ThoughtDocument>, private noteService: NoteService) {}

    async create(createThoughtDto: CreateThoughtDto): Promise<Thought> {
        const createdThought = new this.thoughtModel(createThoughtDto);

        // if the noteId is not a valid ObjectId, create a new note
        if (!Types.ObjectId.isValid(createThoughtDto.noteId)) {
            // create a new note
            const newNote = await this.noteService.create({title: "Untitled", thoughts: [] });
            // add the noteId to the thought
            createdThought.noteId = newNote._id;

            await this.noteService.AddThought(newNote._id, {_id: createdThought._id, content: createThoughtDto.content, noteId: newNote._id });

        } else {
            // find the note by the noteId
            const note = await this.noteService.GetOne(createThoughtDto.noteId);
            // add the thought to the note
            note.thoughts.push(createdThought);
            // save the note
            await this.noteService.UpdateOne(note._id, {title: note.title, thoughts: note.thoughts});
        }

        createdThought.save();

        return createdThought;
    }

    // I hardly see a use for this but you never know
    async FindAll(): Promise<Thought[]> {
        return this.thoughtModel.find().exec();
    }

    // filter by content
    async FindAllByContent(content: string): Promise<Thought[]> {

        // this is a regex search
        // https://docs.mongodb.com/manual/reference/operator/query/regex/
        return this.thoughtModel.find({content: {$regex: content, $options: "i"}}).exec();
    }

    // get
    async GetOne(id: string): Promise<Thought> {
        return this.thoughtModel.findById(id).exec();
    }

    // delete one
    async DeleteOne(id: string): Promise<Thought> {
        const thought = await this.thoughtModel.findByIdAndRemove({_id: id}).exec();

        return thought;
    }

}