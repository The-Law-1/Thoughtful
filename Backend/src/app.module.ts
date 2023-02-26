import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { ThoughtsModule } from "./thoughts/thoughts.module";
import { NoteModule } from "./notes/note.module";
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [ConfigModule.forRoot({isGlobal: true}), // * isGlobal: true doesn't work *clown emoji* import it in all your modules
              MongooseModule.forRoot(`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
                                     {dbName: "Thoughtful"}),
              ThoughtsModule,
              NoteModule,
              AuthModule],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule {}
