import mongoose from "mongoose";

export class Thought {
    _id: mongoose.Types.ObjectId;
    content: string;
    noteId: mongoose.Types.ObjectId;
}