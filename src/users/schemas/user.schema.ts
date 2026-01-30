import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserRole = 'SUPERADMIN' | 'LIVREUR' | 'CLIENT';
export type AuthProvider = 'local' | 'google' | 'facebook' | 'apple';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop({
    required: true,
    enum: ['SUPERADMIN', 'LIVREUR', 'CLIENT'],
    default: 'CLIENT',
  })
  role: UserRole;

  @Prop({ required: false })
  phoneNumber: string;

  @Prop({ required: false })
  latitude: number;

  @Prop({ required: false })
  longitude: number;

  @Prop({ required: false, unique: true, sparse: true })
  firebaseUid: string;

  @Prop({ required: true, enum: ['local', 'google', 'facebook', 'apple'], default: 'local' })
  authProvider: AuthProvider;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Date })
  lastLogin: Date;

  @Prop()
  photoURL: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Index pour optimiser les recherches
UserSchema.index({ email: 1 });
UserSchema.index({ firebaseUid: 1 });
UserSchema.index({ role: 1 });
