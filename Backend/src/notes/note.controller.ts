import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { CreateNoteDto } from "./dto/create-note.dto";
import { NoteService } from "./note.service";
import { Note } from "./schemas/note.schema";

@Controller("notes")
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    /**
     * Create a new note
     * @param createNoteDto create note object.
     * @returns Note
     */
    @Post()
    @HttpCode(201)
    async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
        return this.noteService.create(createNoteDto);
    }

    /**
     * Find all notes
     * @returns All notes
     */
    @Get()
    async findAll(): Promise<Note[]> {
        return this.noteService.FindAll();
    }

    /**
     * Filter by title
     * @param title Title filter
     * @returns A list of notes
     */
    @Get("filter/:title")
    async findAllByTitle(@Param("title") title: string): Promise<Note[]> {
        return this.noteService.FindAllByTitle(title);
    }

    /**
     * Find note by ID
     * @param idParam Note ID
     * @returns A note
     */
    @Get(":id")
    async findOne(@Param("id") idParam: string): Promise<Note> {
        return this.noteService.GetOne(idParam);
    }

    /**
     * Delete a note
     * @param idParam Note ID
     * @returns Deleted note
     */
    @Delete(":id")
    @HttpCode(204)
    async deleteOne(@Param("id") idParam: string): Promise<Note> {
        return this.noteService.DeleteOne(idParam);
    }

    /**
     * Update a note
     * @param idParam id of the note to update
     * @param createNoteDto update note object
     * @returns updated note
     */
    @Patch(":id")
    @HttpCode(204)
    async updateOne(@Param("id") idParam: string, @Body() createNoteDto: CreateNoteDto): Promise<Note> {
        return this.noteService.UpdateOne(idParam, createNoteDto);
    }
}