import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ThoughtDocument = HydratedDocument<Thought>;

@Schema()
export class Thought {
    @Prop({required: true})
    content: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: "noteId", required: true})
    noteId: any;
}

export const ThoughtSchema = SchemaFactory.createForClass(Thought);