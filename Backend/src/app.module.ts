import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsController } from "./cats/cats.controller";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    // ! I have no clue if this URL is correct
	imports: [MongooseModule.forRoot("mongodb://localhost/nest")],
	controllers: [AppController, CatsController],
	providers: [AppService],
})
export class AppModule {}
