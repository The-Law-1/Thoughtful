import {
    Body,
    Controller, Delete, Get, HttpCode, Param, Post, UseGuards,
} from "@nestjs/common";
import { ThoughtsService } from "./thoughts.service";
import { Thought, ThoughtSchema } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";
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
    async GetOne(@Param("id") idParam: string): Promise<Thought> {
        return this.thoughtsService.GetOne(idParam);
    }

    /**
     * Delete a thought
     * @param idParam Thought ID
     * @returns The deleted thought
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(":id")
    @HttpCode(204)
    async deleteOne(@Param("id") idParam: string): Promise<Thought> {
        return this.thoughtsService.DeleteOne(idParam);
    }






}