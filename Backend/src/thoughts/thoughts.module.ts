import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThoughtsController } from "./thoughts.controller";
import { ThoughtsService } from "./thoughts.service";
import { Thought, ThoughtSchema } from "./schemas/thought.schema";
import { NoteModule } from "src/notes/note.module";

@Module({
    imports: [MongooseModule.forFeature([{ name: Thought.name, schema: ThoughtSchema }]), NoteModule],
    controllers: [ThoughtsController],
    providers: [ThoughtsService],

})

export class ThoughtsModule {}