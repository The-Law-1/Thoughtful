import mongoose from "mongoose";
import { UpdateThoughtDto } from "src/thoughts/dto/update-thought.dto";
import { Thought } from "src/types/thought";

export class UpdateNoteDto {
    title: string;
    thoughtsToUpdate: UpdateThoughtDto[];
}