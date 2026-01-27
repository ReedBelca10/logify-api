import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateDeliveryStatusDto {
  @IsEnum(['ASSIGNEE', 'EN_COURS', 'LIVREE'], {
    message: 'Le statut doit être ASSIGNEE, EN_COURS ou LIVREE',
  })
  @IsNotEmpty()
  status: string;
}
