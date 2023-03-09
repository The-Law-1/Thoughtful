import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Types } from "mongoose";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Thought } from "src/types/thought";
import { CreateNoteDto } from "./dto/create-note.dto";
import { UpdateNoteDto } from "./dto/update-note.dto";
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @HttpCode(201)
    async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
        return await this.noteService.create(createNoteDto);
    }

    /**
     * Find all notes
     * @returns All notes
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async findAll(): Promise<Note[]> {
        return this.noteService.FindAll();
    }

    /**
     * Filter by title
     * @param title Title filter
     * @returns A list of notes
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("filter/:title")
    async findAllByTitle(@Param("title") title: string): Promise<Note[]> {
        return this.noteService.FindAllByTitle(title);
    }

    /**
     * Find note by ID
     * @param idParam Note ID
     * @returns A note
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(":id")
    async findOne(@Param("id") idParam: string): Promise<Note> {
        return this.noteService.GetOne(idParam);
    }

// /**
//  * Delete a note
//  * @param idParam Note ID
//  * @returns Deleted note
//  */
// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
// @Delete(":id")
// @HttpCode(200)
// async deleteOne(@Param("id") idParam: string): Promise<Note> {
//     return this.noteService.DeleteOne(idParam);
// }

    // /**
    //  * Update a note
    //  * @param idParam id of the note to update
    //  * @param createNoteDto update note object
    //  * @returns updated note
    //  */
    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // @Patch(":id")
    // @HttpCode(200)
    // async updateOne(@Param("id") idParam: string, @Body() updateNoteDto: UpdateNoteDto): Promise<Note> {
    //     // url decode id?
    //     // decodeURIComponent(idParam);
    //     return this.noteService.UpdateOne(new Types.ObjectId(idParam), updateNoteDto);
    // }

    /**
     * Rename a note
     * @param idParam id of the note to rename
     * @param newTitle new title of the note
     * @returns updated note
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put("rename/:id/:title")
    @HttpCode(204)
    async renameOne(@Param("id") idParam: string, @Param("title") newTitle: string): Promise<Note> {
        return this.noteService.RenameNote(new Types.ObjectId(idParam), newTitle);
    }
}