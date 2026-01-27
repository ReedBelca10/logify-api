import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        dishId: { type: Types.ObjectId, ref: 'Dish' },
        quantity: Number,
      },
    ],
    required: true,
  })
  items: { dishId: Types.ObjectId; quantity: number }[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    required: true,
    enum: ['EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'],
    default: 'EN_ATTENTE',
  })
  status: string;

  @Prop({ required: true })
  address: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
