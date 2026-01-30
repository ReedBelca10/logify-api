import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) { }

  @ApiOperation({
    summary: 'Récupérer la liste des commandes (ADMIN uniquement)',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer une commande par id' })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.ordersService.findById(id);
  }

  @ApiOperation({ summary: 'Récupérer les commandes d un utilisateur' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.ordersService.findByUserId(userId);
  }

  @ApiOperation({ summary: 'Créer une commande' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: AuthenticatedRequest,
  ) {
    // TODO: Calculer le prix total depuis les dishes
    const totalPrice = 0;
    const userId = req.user?.userId || 'unknown';
    return await this.ordersService.create(userId, createOrderDto, totalPrice);
  }

  @ApiOperation({
    summary: "Mettre à jour le statut d'une commande (ADMIN uniquement)",
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateStatus(id, updateOrderStatusDto);
  }
}
