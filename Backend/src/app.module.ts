import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsController } from "./cats/cats.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsService } from "./cats/cats.service";
import { CatsModule } from "./cats/cats.module";
import { CatSchema } from "./cats/schemas/cat.schema";

@Module({
	imports: [MongooseModule.forRoot("mongodb://root:root@localhost:27017", {dbName: "Thoughtful"}), CatsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
