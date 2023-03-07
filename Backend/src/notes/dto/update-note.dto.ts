import mongoose from "mongoose";
import { Thought } from "src/types/thought";

export class UpdateNoteDto {
    title: string;
    thoughtsToUpdate: Thought[];
    thoughtsToRemove: Thought[];
}