import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DeliveriesService } from './deliveries.service';
import { AssignDeliveryDto } from './dto/assign-delivery.dto';
import { UpdateDeliveryStatusDto } from './dto/update-delivery-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Deliveries')
@ApiBearerAuth('access-token')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private deliveriesService: DeliveriesService) { }

  @ApiOperation({
    summary: 'Récupérer la liste des livraisons (ADMIN uniquement)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get()
  async findAll() {
    return await this.deliveriesService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer une livraison par id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.deliveriesService.findById(id);
  }

  @ApiOperation({ summary: 'Récupérer les livraisons d un livreur' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIVREUR')
  @Get('man/:deliveryManId')
  async findByDeliveryManId(@Param('deliveryManId') deliveryManId: string) {
    return await this.deliveriesService.findByDeliveryManId(deliveryManId);
  }

  @ApiOperation({ summary: 'Assigner une livraison (ADMIN uniquement)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post()
  async assign(@Body() assignDeliveryDto: AssignDeliveryDto) {
    return await this.deliveriesService.assign(assignDeliveryDto);
  }

  @ApiOperation({ summary: "Mettre à jour le statut d'une livraison" })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIVREUR')
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDeliveryStatusDto: UpdateDeliveryStatusDto,
  ) {
    return await this.deliveriesService.updateStatus(
      id,
      updateDeliveryStatusDto,
    );
  }
}
