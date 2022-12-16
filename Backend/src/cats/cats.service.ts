import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cat, CatDocument } from "./schemas/cat.schema";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
    constructor(@InjectModel(Cat.name) private catModel: Model<CatDocument>) {}

    async create(createCatDto: CreateCatDto): Promise<Cat> {
        const createdCat = new this.catModel(createCatDto);
        return createdCat.save();
    }

    async FindAll(): Promise<Cat[]> {
        return this.catModel.find().exec();
    }

    // get
    async GetOne(id: string): Promise<Cat> {
        return this.catModel.findById(id).exec();
    }

    // delete one
    async DeleteOne(id: string): Promise<boolean> {

        const cat = await this.catModel.findById(id).exec();
        if (cat === null) {
            return false;
        }

        const deletedResult = await cat.delete().exec();

        if (deletedResult.deletedCount === 1) {
            return true;
        } else {
            return false;
        }
    }


}