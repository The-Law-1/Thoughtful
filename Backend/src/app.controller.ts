import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Request, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Types } from "mongoose";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { AuthDto } from "./auth/dto/auth.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { UpdateNoteDto } from "./notes/dto/update-note.dto";
import { NoteService } from "./notes/note.service";
import { Note } from "./notes/schemas/note.schema";
import { ThoughtsService } from "./thoughts/thoughts.service";
import { Thought } from "./types/thought";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService, private authService: AuthService, private noteService: NoteService, private thoughtService: ThoughtsService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

    // @UseGuards(AuthGuard()) 
    @Post('auth/login')
    @HttpCode(200)
    @HttpCode(401)
    async login(@Body() auth: AuthDto) {
        if (await this.authService.authenticate(auth.password)) {
            return this.authService.createJWT();
        }
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    @UseGuards(JwtAuthGuard)
    @Get("auth/verify")
    @HttpCode(200)
    @HttpCode(401)
    async verify() {
        // if this goes through, the token is valid, you might as well just call the profile endpoint
        return HttpStatus.OK;
    }

    // TODO update note here and call both services separately
    /**
     * Update a note
     * @param idParam id of the note to update
     * @param createNoteDto update note object
     * @returns updated note
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch("notes/:id")
    @HttpCode(200)
    async updateOne(@Param("id") idParam: string, @Body() updateNoteDto: UpdateNoteDto): Promise<Note> {
        // url decode id?
        // decodeURIComponent(idParam);

        let createdThoughts = [];

        // create/update thoughts
        updateNoteDto.thoughtsToUpdate.forEach(async (thought: Thought , i) => {
            let isNew = thought._id == null;

            let updatedThought = await this.thoughtService.UpdateOne(thought._id ? thought._id.toString() : null, thought);

            if (isNew) {
                createdThoughts.push(updatedThought._id);
            }
        });

        // remove thoughts

        return this.noteService.UpdateOne(new Types.ObjectId(idParam), updateNoteDto.title, createdThoughts, updateNoteDto.thoughtsToRemove.map(thought => thought._id.toString()));
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
