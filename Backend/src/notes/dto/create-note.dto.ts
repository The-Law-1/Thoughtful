import mongoose from "mongoose";
import { Thought } from "src/types/thought";

export class CreateNoteDto {
    title: string;
    thoughts: string[]; // thought ids
}