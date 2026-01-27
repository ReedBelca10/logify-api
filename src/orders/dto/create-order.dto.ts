import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty({ message: "L'ID du plat est requis" })
  dishId: string;

  @IsNumber({}, { message: 'La quantité doit être un nombre' })
  @Min(1, { message: 'La quantité doit être au moins 1' })
  quantity: number;
}

export class CreateOrderDto {
  @IsArray({ message: 'Les articles doivent être un tableau' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNotEmpty({ message: "L'adresse de livraison est requise" })
  address: string;
}
