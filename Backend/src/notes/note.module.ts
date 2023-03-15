import { forwardRef, Module } from "@nestjs/common";
import { MyFireStoreService } from "src/firebase/firebase.service";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";

@Module({
    imports: [],
    controllers: [NoteController],
    providers: [NoteService, MyFireStoreService],
    exports: [NoteService]
})

export class NoteModule {}