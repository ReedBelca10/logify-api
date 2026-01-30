import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Delivery } from './schemas/delivery.schema';
import { AssignDeliveryDto } from './dto/assign-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectModel(Delivery.name) private deliveryModel: Model<Delivery>,
  ) {}

  async findAll() {
    return await this.deliveryModel
      .find()
      .populate('orderId')
      .populate('deliveryManId');
  }

  async findById(id: string) {
    return await this.deliveryModel
      .findById(id)
      .populate('orderId')
      .populate('deliveryManId');
  }

  async findByDeliveryManId(deliveryManId: string) {
    return await this.deliveryModel
      .find({ deliveryManId })
      .populate('orderId')
      .populate('deliveryManId');
  }

  async assign(assignDeliveryDto: AssignDeliveryDto) {
    const newDelivery = new this.deliveryModel({
      orderId: assignDeliveryDto.orderId,
      deliveryManId: assignDeliveryDto.deliveryManId,
      status: 'ASSIGNEE',
    });
    return await newDelivery.save();
  }

  async updateStatus(
    id: string,
    updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    return await this.deliveryModel.findByIdAndUpdate(
      id,
      { status: updateDeliveryStatusDto.status },
      { new: true },
    );
  }

  async delete(id: string) {
    return await this.deliveryModel.findByIdAndDelete(id);
  }
}
