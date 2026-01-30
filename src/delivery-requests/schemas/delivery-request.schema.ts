import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class DeliveryRequest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  idClient: Types.ObjectId;

  @Prop({ required: true })
  nomExpediteur: string;

  @Prop({ required: true })
  prenomExpediteur: string;

  @Prop({ required: true })
  numeroTelephoneExpediteur: string;

  @Prop({ required: false })
  emailExpediteur: string;

  @Prop({ required: true })
  latitudeExpediteur: number;

  @Prop({ required: true })
  longitudeExpediteur: number;

  @Prop({ required: true })
  nomRecepteur: string;

  @Prop({ required: true })
  prenomRecepteur: string;

  @Prop({ required: true })
  numeroTelephoneRecepteur: string;

  @Prop({ required: false })
  emailRecepteur: string;

  @Prop({ required: true })
  latitudeRecepteur: number;

  @Prop({ required: true })
  longitudeRecepteur: number;

  @Prop({
    required: true,
    enum: ['DOC', 'SMALL', 'MEDIUM', 'LARGE', 'XL'],
  })
  categorieColis: string;

  @Prop({ required: false })
  photoColis: string;

  @Prop({ required: true })
  dateHeureLimite: Date;

  @Prop({ required: true })
  distance: number;

  @Prop({ required: true })
  tarif: number;

  @Prop({
    required: true,
    enum: ['EN_ATTENTE', 'ASSIGNEE', 'LIVREE', 'ANNULEE'],
    default: 'EN_ATTENTE',
  })
  statut: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  idLivreur: Types.ObjectId;

  @Prop({ default: Date.now })
  dateCreation: Date;

  @Prop({ required: false })
  dateAssignation: Date;

  @Prop({ required: false })
  dateLivraison: Date;
}

export const DeliveryRequestSchema =
  SchemaFactory.createForClass(DeliveryRequest);
