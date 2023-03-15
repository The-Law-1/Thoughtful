import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MyFireStoreService } from "src/firebase/firebase.service";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { Note, NoteSchema } from "./schemas/note.schema";

@Module({
    imports: [],
    controllers: [NoteController],
    providers: [NoteService, MyFireStoreService],
    exports: [NoteService]
})

export class NoteModule {}