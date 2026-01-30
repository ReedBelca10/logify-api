import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { DeliveryRequestsService } from './delivery-requests.service';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestStatusDto } from './dto/update-delivery-request-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/packages');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('Delivery Requests')
@Controller('delivery-requests')
export class DeliveryRequestsController {
  constructor(private deliveryRequestsService: DeliveryRequestsService) { }

  @ApiOperation({
    summary: 'Creer une demande de livraison avec photo du colis',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photoColis', { storage }))
  async create(
    @Body() createDeliveryRequestDto: CreateDeliveryRequestDto,
    @Request() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const idClient = req.user?.userId || 'unknown';
    const photoColis = file ? `/uploads/packages/${file.filename}` : undefined;
    return await this.deliveryRequestsService.create(idClient, {
      ...createDeliveryRequestDto,
      photoColis,
    });
  }

  @ApiOperation({
    summary: 'Recuperer les statistiques globales (ADMIN uniquement)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get('stats')
  async getGlobalStats(): Promise<any> {
    return await this.deliveryRequestsService.getGlobalStats();
  }

  @ApiOperation({ summary: 'Recuperer les demandes du client connecte' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get('my-requests')
  async findMyRequests(@Request() req: AuthenticatedRequest) {
    const idClient = req.user?.userId || 'unknown';
    return await this.deliveryRequestsService.findByClientId(idClient);
  }

  @ApiOperation({
    summary: 'Recuperer les demandes assignees au livreur connecte',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIVREUR')
  @Get('my-deliveries')
  async findMyDeliveries(@Request() req: AuthenticatedRequest) {
    const idLivreur = req.user?.userId || 'unknown';
    return await this.deliveryRequestsService.findByDeliveryManId(idLivreur);
  }

  @ApiOperation({
    summary: 'Recuperer les statistiques du livreur connecte',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('LIVREUR')
  @Get('my-stats')
  async getMyStats(@Request() req: AuthenticatedRequest): Promise<any> {
    const idLivreur = req.user?.userId || 'unknown';
    return await this.deliveryRequestsService.getDeliveryManStats(idLivreur);
  }

  @ApiOperation({ summary: 'Recuperer toutes les demandes (ADMIN uniquement)' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Get()
  async findAll() {
    return await this.deliveryRequestsService.findAll();
  }

  @ApiOperation({ summary: 'Recuperer une demande par id' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.deliveryRequestsService.findById(id);
  }

  @ApiOperation({ summary: 'Mettre a jour le statut d une demande' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDeliveryRequestStatusDto: UpdateDeliveryRequestStatusDto,
  ) {
    return await this.deliveryRequestsService.updateStatus(
      id,
      updateDeliveryRequestStatusDto,
    );
  }

  @ApiOperation({
    summary: 'Assigner une demande a un livreur (ADMIN uniquement)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Put(':id/assign/:idLivreur')
  @HttpCode(HttpStatus.OK)
  async assignToDeliveryMan(
    @Param('id') id: string,
    @Param('idLivreur') idLivreur: string,
  ) {
    return await this.deliveryRequestsService.assignToDeliveryMan(
      id,
      idLivreur,
    );
  }

  @ApiOperation({
    summary: 'Annuler une demande de livraison (CLIENT uniquement)',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT')
  @Put(':id/cancel')
  @HttpCode(HttpStatus.OK)
  async cancelDelivery(@Param('id') id: string): Promise<any> {
    return await this.deliveryRequestsService.cancelDelivery(id);
  }
}
