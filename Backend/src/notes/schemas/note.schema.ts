import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";
import { Thought } from 'src/types/thought';

export type NoteDocument = HydratedDocument<Note>;

export class Note {
    @Prop()
    title: string;

    @Prop()
    thoughts: Thought[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);