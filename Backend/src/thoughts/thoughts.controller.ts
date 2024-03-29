import {
    BadRequestException,
    Body,
    Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards,
} from "@nestjs/common";
import { ThoughtsService } from "./thoughts.service";
import { Thought } from "../types/thought";
import { CreateThoughtDto } from "./dto/create-thought.dto";
import { UpdateThoughtDto } from "./dto/update-thought.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller({ path: "thoughts" })
export class ThoughtsController {
    constructor(private readonly thoughtsService: ThoughtsService) {}

    /**
     * Create a new thought, will create a new note if the noteId is not valid
     * @param createThoughtDto Thought creation object
     * @returns A new thought
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @HttpCode(201)
    async create(@Body() createThoughtDto: CreateThoughtDto): Promise<Thought> {
        return this.thoughtsService.create(createThoughtDto);
    }

    /**
     * Add thought to note, either creating using title or simply adding
     * @param noteTitle title of note to create
     * @param createThoughtDto thought to create
     * @returns created thought
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("note/:title")
    @HttpCode(201)
    async addThoughtToNote(@Param("title") noteTitle:string, @Body() createThoughtDto: CreateThoughtDto): Promise<Thought> {
        return this.thoughtsService.addThoughtToNote(noteTitle, createThoughtDto);
    }

    /**
     * Get all thoughts
     * @returns All thoughts
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async findAll(): Promise<Thought[]> {
        return this.thoughtsService.FindAll();
    }

    /**
     * Search for thoughts by content
     * @param search Content search
     * @returns A list of thoughts
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("filter/:search")
    async findAllByContent(@Param("search") search: string): Promise<Thought[]> {
        return this.thoughtsService.FindAllByContent(search);
    }

    /**
     * Get a thought by its ID
     * @param idParam Thought ID
     * @returns A thought
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get(":id")
    @HttpCode(200)
    @HttpCode(400)
    async GetOne(@Param("id") idParam: string): Promise<Thought> {
        let thought = await this.thoughtsService.GetOne(idParam);

        if (!thought) {
            throw new BadRequestException("Thought not found");
        }
        return thought;
    }

    /**
     * Delete a thought
     * @param idParam Thought ID
     * @returns The deleted thought
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(":id")
    @HttpCode(200)
    async deleteOne(@Param("id") idParam: string): Promise<boolean> {
        return this.thoughtsService.DeleteOne(idParam);
    }

    /**
     * Update multiple thoughts.
     * @param thoughts thoughts to update.
     * @returns Updated thoughts
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("update/multiple")
    @HttpCode(200)
    async updateMultiple(@Body() thoughts: UpdateThoughtDto[]): Promise<Thought[]> {
        return this.thoughtsService.UpdateMultiple(thoughts);
    }

    /**
     * Get thoughts in note.
     * @param noteId id of note we want the thoughts of.
     * @returns List of thoughts.
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("note/:noteId")
    @HttpCode(200)
    async GetThoughtsForNote(@Param("noteId") noteId: string): Promise<Thought[]> {
        return this.thoughtsService.FindThoughtsForNoteId(noteId);
    }
}