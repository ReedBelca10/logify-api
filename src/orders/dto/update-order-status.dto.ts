import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsEnum(['EN_ATTENTE', 'EN_PREPARATION', 'PRETE', 'EN_LIVRAISON', 'LIVREE'], {
    message:
      'Le statut doit être EN_ATTENTE, EN_PREPARATION, PRETE, EN_LIVRAISON ou LIVREE',
  })
  @IsNotEmpty()
  status: string;
}
