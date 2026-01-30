import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @ApiProperty({ description: 'ID du plat (ObjectId MongoDB)' })
  @IsNotEmpty({ message: "L'ID du plat est requis" })
  dishId: string;

  @ApiProperty({ description: 'Quantité du plat commandé' })
  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Min(1, { message: 'La quantité doit être au moins 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Liste des articles de la commande',
    type: [OrderItemDto],
  })
  @IsArray({ message: 'Les articles doivent être un tableau' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Adresse de livraison' })
  @IsNotEmpty({ message: "L'adresse de livraison est requise" })
  address: string;
}
