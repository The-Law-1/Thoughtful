import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsModule } from "./cats/cats.module";
import { ConfigModule } from "@nestjs/config";
import { ThoughtsModule } from "./thoughts/thoughts.module";
import { NoteModule } from "./notes/note.module";

@Module({
	imports: [ConfigModule.forRoot({isGlobal: true}),
              MongooseModule.forRoot(`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
                                     {dbName: "Thoughtful"}),
              CatsModule,
              ThoughtsModule,
              NoteModule],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule {}
