import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from "mongoose";
import { Thought } from 'src/types/thought';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
    _id: mongoose.Types.ObjectId;

    @Prop({default: "Untitled"})
    title: string;

    @Prop()
    thoughts: Thought[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);