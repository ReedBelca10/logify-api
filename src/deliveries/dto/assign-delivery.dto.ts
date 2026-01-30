import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignDeliveryDto {
  @ApiProperty({ description: 'ID de la commande (ObjectId MongoDB)' })
  @IsNotEmpty({ message: "L'ID de la commande est requis" })
  orderId: string;

  @ApiProperty({ description: 'ID du livreur (ObjectId MongoDB)' })
  @IsNotEmpty({ message: "L'ID du livreur est requis" })
  deliveryManId: string;
}
