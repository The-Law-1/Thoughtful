import {
    Body,
    Controller, Delete, Get, HttpCode, Param, Post,
} from "@nestjs/common";
import { ThoughtsService } from "./thoughts.service";
import { Thought, ThoughtSchema } from "./schemas/thought.schema";
import { CreateThoughtDto } from "./dto/create-thought.dto";

@Controller({ path: "thoughts" })
export class ThoughtsController {
    constructor(private readonly thoughtsService: ThoughtsService) {}

    /**
     * Create a new thought, will create a new note if the noteId is not valid
     * @param createThoughtDto Thought creation object
     * @returns A new thought
     */
    @Post()
    @HttpCode(201)
    async create(@Body() createThoughtDto: CreateThoughtDto): Promise<Thought> {
        return this.thoughtsService.create(createThoughtDto);
    }

    /**
     * Get all thoughts
     * @returns All thoughts
     */
    @Get()
    async findAll(): Promise<Thought[]> {
        return this.thoughtsService.FindAll();
    }

    /**
     * Search for thoughts by content
     * @param search Content search
     * @returns A list of thoughts
     */
    @Get(":search")
    async findAllByContent(@Param("search") search: string): Promise<Thought[]> {
        return this.thoughtsService.FindAllByContent(search);
    }

    /**
     * Get a thought by its ID
     * @param idParam Thought ID
     * @returns A thought
     */
    @Get(":id")
    async findOne(@Param("id") idParam: string): Promise<Thought> {
        return this.thoughtsService.GetOne(idParam);
    }

    /**
     * Delete a thought
     * @param idParam Thought ID
     * @returns The deleted thought
     */
    @Delete(":id")
    @HttpCode(204)
    async deleteOne(@Param("id") idParam: string): Promise<Thought> {
        return this.thoughtsService.DeleteOne(idParam);
    }






}