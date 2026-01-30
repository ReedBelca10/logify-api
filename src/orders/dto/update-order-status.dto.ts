import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Statut de la commande',
    enum: ['EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'],
  })
  @IsEnum(['EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'], {
    message:
      'Le statut doit être EN_ATTENTE, EN_PREPARATION, PRETE, EN_LIVRAISON ou LIVREE',
  })
  @IsNotEmpty()
  status: string;
}
