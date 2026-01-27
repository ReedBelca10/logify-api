import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Delivery extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  deliveryManId: Types.ObjectId;

  @Prop({
    required: true,
    enum: ['ASSIGNEE', 'EN_COURS', 'LIVREE'],
    default: 'ASSIGNEE',
  })
  status: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
