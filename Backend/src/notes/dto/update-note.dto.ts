import { UpdateThoughtDto } from "src/thoughts/dto/update-thought.dto";

export class UpdateNoteDto {
    title: string;
    thoughtsToUpdate: UpdateThoughtDto[];
}