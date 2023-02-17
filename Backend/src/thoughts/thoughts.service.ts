import mongoose, { Model, Types } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel, Schema } from "@nestjs/mongoose";
import { Thought, ThoughtDocument } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";

@Injectable()
export class ThoughtsService {
    constructor(@InjectModel(Thought.name) private thoughtModel: Model<ThoughtDocument>) {}

    async create(createThoughtDto: CreateThoughtDto): Promise<Thought> {
        const createdThought = new this.thoughtModel(createThoughtDto);

        // if the noteId is not a valid ObjectId, create a new note
        if (!Types.ObjectId.isValid(createThoughtDto.noteId)) {
            // create a new note
            // add the noteId to the thought
            // save the thought
            createdThought.noteId = new Types.ObjectId();
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