import { BadRequestException, Body, Controller, Delete, Get, Header, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Request, StreamableFile, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiNoContentResponse, ApiOkResponse } from "@nestjs/swagger";
import { createReadStream, readdirSync, rmSync } from "fs";
import { Types } from "mongoose";
import { join } from "path";
import { AppService } from "./app.service";
import { AuthService } from "./auth/auth.service";
import { AuthDto } from "./auth/dto/auth.dto";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { UpdateNoteDto } from "./notes/dto/update-note.dto";
import { NoteService } from "./notes/note.service";
import { Note } from "./notes/schemas/note.schema";
import { ThoughtsService } from "./thoughts/thoughts.service";
import { Thought } from "./types/thought";
const fs = require('fs');

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

        let updatedThoughts = await this.thoughtService.UpdateMultiple(updateNoteDto.thoughtsToUpdate);

        // remove thoughts
        if (updatedThoughts.length !== updateNoteDto.thoughtsToUpdate.length) {
            throw new BadRequestException("Thoughts to update did not match updated thoughts");
        }

        return this.noteService.RenameNote(new Types.ObjectId(idParam), updateNoteDto.title);
    }

    /**
     * Delete a note
     * @param idParam Note ID
     * @returns Deleted note
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete("notes/:id")
    @HttpCode(200)
    async deleteOne(@Param("id") idParam: string): Promise<Note> {

        // delete all thoughts with noteId
        let deletedThoughts = await this.thoughtService.DeleteAllWithNoteId(idParam);

        return this.noteService.DeleteOne(idParam);
    }

    /**
     * Export a note as a html file
     * @param idParam Note ID
     * @returns a html file??
     */
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get("notes/export/html/:id")
    @Header('Content-Type', 'application/json')
    @Header('Content-Disposition', 'attachment; filename="export"')
    async exportNoteHtml(@Param("id") idParam: string): Promise<StreamableFile> {
        let note = await this.noteService.GetOne(idParam);
        let thoughts = await this.thoughtService.FindThoughtsForNoteId(new Types.ObjectId(idParam));

        // TODO should put this in a note service
        let html = `
<html>
    <head>
        <title>${note.title}</title>
    </head>
    <body>
        <h1>${note.title}</h1>
        `;

        thoughts.forEach(thought => {
            html += `<p>${thought.content}</p>`;
        });

        html += `
    </body>
</html>
        `;

        // write to local file
        await fs.writeFile("./exports/" + note.title + ".html", html, (err) => {
            console.log("error: " + err);
        });

        // return the file
        const file = createReadStream(join(process.cwd(), "exports/" + note.title + ".html"));

        let stream = new StreamableFile(file);

        // delete file after?
        // fs.unlink(note.title + ".html", (err) => {
        //     if (err) {
        //         console.error(err)
        //     }
        // });

        return stream;
    }

    /**
     * route to cleanup exports folder
     */
    @Delete("notes/export/cleanup")
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @HttpCode(204)
    async cleanupExports() {
        const dir = "exports";

        readdirSync(dir).forEach(f => {
            if (f !== ".gitkeep")
                rmSync(`${dir}/${f}`);
        });

        return ApiNoContentResponse();
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

}
