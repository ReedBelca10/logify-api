import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Dish extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: true })
  available: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const DishSchema = SchemaFactory.createForClass(Dish);
