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

// host means you can only access this controller if you are on localhost
@Controller({ path: "cats", host: "localhost" })
export class CatsController {
	@Get()
	findAll(@Req() request: Request): string {
		return "This action returns all cats";
	}

	@Post()
	@HttpCode(201)
	@Header("Cache-Control", "none") // not exactly useful
	create(@Body() createCatObject: CreateCatDto): string {
		return "This action adds a new cat";
	}

	@Get(":id")
	findOne(@Param("id") idParam: string): string {
		console.log(idParam);
		return `This action returns a #${idParam} cat`;
	}

	@Delete(":id")
	remove(@Param("id") idParam: string): string {
		console.log(idParam);
		return `This action removes a #${idParam} cat`;
	}
}
