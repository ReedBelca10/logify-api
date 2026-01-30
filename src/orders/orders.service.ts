import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll() {
    return await this.orderModel
      .find()
      .populate('userId')
      .populate('items.dishId');
  }

  async findById(id: string) {
    return await this.orderModel
      .findById(id)
      .populate('userId')
      .populate('items.dishId');
  }

  async findByUserId(userId: string) {
    return await this.orderModel
      .find({ userId })
      .populate('userId')
      .populate('items.dishId');
  }

  async create(
    userId: string,
    createOrderDto: CreateOrderDto,
    totalPrice: number,
  ) {
    const newOrder = new this.orderModel({
      userId,
      items: createOrderDto.items,
      totalPrice,
      address: createOrderDto.address,
      status: 'EN_ATTENTE',
    });
    return await newOrder.save();
  }

  async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
    return await this.orderModel.findByIdAndUpdate(
      id,
      { status: updateOrderStatusDto.status },
      { new: true },
    );
  }

  async delete(id: string) {
    return await this.orderModel.findByIdAndDelete(id);
  }
}
