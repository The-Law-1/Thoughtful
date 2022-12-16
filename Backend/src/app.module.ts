import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsController } from "./cats/cats.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsService } from "./cats/cats.service";
import { CatsModule } from "./cats/cats.module";
import { CatSchema } from "./cats/schemas/cat.schema";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [ConfigModule.forRoot({isGlobal: true}),
              MongooseModule.forRoot(`mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`,
                                     {dbName: "Thoughtful"}),
              CatsModule],
	controllers: [AppController],
	providers: [AppService],
})

export class AppModule {}
