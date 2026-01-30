import { IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDeliveryRequestStatusDto {
  @ApiProperty({
    description: 'Nouveau statut: EN_ATTENTE, ASSIGNEE, LIVREE, ANNULEE',
    enum: ['EN_ATTENTE', 'ASSIGNEE', 'LIVREE', 'ANNULEE'],
  })
  @IsNotEmpty({ message: 'Le statut est requis' })
  @IsEnum(['EN_ATTENTE', 'ASSIGNEE', 'LIVREE', 'ANNULEE'])
  statut: string;
}
