import { IsNotEmpty } from 'class-validator';

export class AssignDeliveryDto {
  @IsNotEmpty({ message: "L'ID de la commande est requis" })
  orderId: string;

  @IsNotEmpty({ message: "L'ID du livreur est requis" })
  deliveryManId: string;
}
