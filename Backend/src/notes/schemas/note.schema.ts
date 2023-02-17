import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from "mongoose";
import { Thought } from 'src/types/thought';

export type NoteDocument = HydratedDocument<Note>;

@Schema()
export class Note {
    @Prop({default: "Untitled"})
    title: string;

    @Prop()
    thoughts: Thought[];
}

export const NoteSchema = SchemaFactory.createForClass(Note);