import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CatsController } from "./cats.controller";
// import { CatsService } from "./cats/cats.service";
import { Cat, CatSchema } from "./schemas/cat.schema";

// * we make a module for cats to store all the stuff and export it as a module
@Module({
    imports: [MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])],
    controllers: [CatsController],
    providers: [],
})

export class CatsModule {}