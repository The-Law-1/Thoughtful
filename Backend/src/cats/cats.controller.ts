import {
	Body,
	Controller,
	Delete,
	Get,
	Header,
	HttpCode,
	Param,
	Post,
	Req,
} from "@nestjs/common";
import { Request } from "express";
import { CreateCatDto } from "./dto/create-cat.dto";
import { CatsService } from "./cats.service";
import { Cat } from "./schemas/cat.schema";

// host means you can only access this controller if you are on localhost
@Controller({ path: "cats", host: "localhost" })
export class CatsController {

    constructor(private readonly CatsService: CatsService) {}

	@Get()
	async findAll(@Req() request: Request): Promise<Cat[]> {
        return await this.CatsService.FindAll();
	}

	@Post()
	@HttpCode(201)
	@Header("Cache-Control", "none") // not exactly useful
	async create(@Body() createCatObject: CreateCatDto): Promise<Cat> {
        return await this.CatsService.create(createCatObject);
	}

	@Get(":id")
	async findOne(@Param("id") idParam: string): Promise<Cat> {
        return await this.CatsService.GetOne(idParam);
	}

	@Delete(":id")
    @HttpCode(204)
	async remove(@Param("id") idParam: string): Promise<string> {
        const deleted = await this.CatsService.DeleteOne(idParam);

        return deleted ? "Success" : "Failure";
	}
}
