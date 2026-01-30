import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    description: 'Statut de la livraison',
    enum: ['ASSIGNEE', 'EN_COURS', 'LIVREE'],
  })
  @IsEnum(['ASSIGNEE', 'EN_COURS', 'LIVREE'], {
    message: 'Le statut doit être ASSIGNEE, EN_COURS ou LIVREE',
  })
  @IsNotEmpty()
  status: string;
}
