import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({required: true})
    age: number;

    @Prop({required:true})
    breed: string;
}

// to store a ref!
// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' })
// owner: Owner

// array of refs...
// @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Owner' }] })
// owner: Owner[];

export const CatSchema = SchemaFactory.createForClass(Cat);