import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dish } from './schemas/dish.schema';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';

@Injectable()
export class MenuService {
  constructor(@InjectModel(Dish.name) private dishModel: Model<Dish>) {}

  async findAll() {
    return await this.dishModel.find();
  }

  async findById(id: string) {
    return await this.dishModel.findById(id);
  }

  async create(createDishDto: CreateDishDto & { imageUrl?: string }) {
    const newDish = new this.dishModel({
      ...createDishDto,
      imageUrl: createDishDto.imageUrl,
    });
    return await newDish.save();
  }

  async update(id: string, updateDishDto: UpdateDishDto) {
    return await this.dishModel.findByIdAndUpdate(id, updateDishDto, {
      new: true,
    });
  }

  async delete(id: string) {
    return await this.dishModel.findByIdAndDelete(id);
  }
}
