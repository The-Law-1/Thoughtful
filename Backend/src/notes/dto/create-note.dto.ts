import { Thought } from "src/types/thought";

export class CreateNoteDto {
    title: string;
    thoughts: Thought[];
}