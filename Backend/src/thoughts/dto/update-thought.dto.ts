export class UpdateThoughtDto {
    id: string;
    content: string;
    noteId: string; // it's a ref to a note, so not quite sure what to do here
}