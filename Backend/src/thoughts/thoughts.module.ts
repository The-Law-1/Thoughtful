import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ThoughtsController } from "./thoughts.controller";
import { ThoughtsService } from "./thoughts.service";
import { Thought, ThoughtSchema } from "./schemas/thought.schema";
import { NoteModule } from "src/notes/note.module";
import { MyFireStoreService } from "src/firebase/firebase.service";

@Module({
    imports: [NoteModule],
    controllers: [ThoughtsController],
    providers: [ThoughtsService, MyFireStoreService],
    exports: [ThoughtsService]
})

export class ThoughtsModule {}