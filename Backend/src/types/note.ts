export class Note {
    id: string;
    title: string;
    thoughts: string[]; // thought ids


    constructor(id: string, title: string, thoughts: string[]) {
        this.id = id;
        this.title = title;
        this.thoughts = thoughts;
    }
}