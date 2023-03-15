import { CreateThoughtDto } from "src/thoughts/dto/create-thought.dto";

export class Thought {
    id: string;
    content: string;
    noteId: string;

    constructor(id: string, content: string, noteId: string) {
        this.id = id;
        this.content = content;
        this.noteId = noteId;
    }
}