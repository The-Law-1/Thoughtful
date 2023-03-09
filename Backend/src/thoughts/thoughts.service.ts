import mongoose, { Model, Types } from "mongoose";
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Thought, ThoughtDocument } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";
import { NoteService } from "src/notes/note.service";
import { Note, NoteDocument } from "src/notes/schemas/note.schema";
import { UpdateThoughtDto } from "./dto/update-thought.dto";

@Injectable()
export class ThoughtsService {
    constructor(
        @InjectModel(Thought.name)
        private thoughtModel: Model<ThoughtDocument>, private noteService: NoteService) {}

    async create(createThoughtDto: CreateThoughtDto): Promise<Thought> {
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
        return this.thoughtModel.find({ noteId: id}).exec();
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

    async UpdateMultiple(thoughts: UpdateThoughtDto[]): Promise<Thought[]> {
        return await Promise.all(thoughts.map(thought => this.UpdateOne(thought._id.toString(), { _id: new Types.ObjectId(thought._id), content: thought.content, noteId: thought.noteId })));
    }

    // update
    async UpdateOne(id: string, thought: Thought): Promise<Thought> {
        let thoughtToUpdate = await this.thoughtModel.findById(id).exec();

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