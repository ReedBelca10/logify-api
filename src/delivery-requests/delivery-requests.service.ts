import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeliveryRequest } from './schemas/delivery-request.schema';
import { CreateDeliveryRequestDto } from './dto/create-delivery-request.dto';
import { UpdateDeliveryRequestStatusDto } from './dto/update-delivery-request-status.dto';
import { PricingService } from '../common/services/pricing.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DeliveryRequestsService {
  constructor(
    @InjectModel(DeliveryRequest.name)
    private deliveryRequestModel: Model<DeliveryRequest>,
    private pricingService: PricingService,
    private usersService: UsersService,
  ) { }

  async create(
    idClient: string,
    createDeliveryRequestDto: CreateDeliveryRequestDto,
  ) {
    const distance = this.pricingService.calculerDistance(
      createDeliveryRequestDto.latitudeExpediteur,
      createDeliveryRequestDto.longitudeExpediteur,
      createDeliveryRequestDto.latitudeRecepteur,
      createDeliveryRequestDto.longitudeRecepteur,
    );

    const tarif = this.pricingService.calculerTarif(
      createDeliveryRequestDto.categorieColis,
      distance,
    );

    const demandeCreation = new this.deliveryRequestModel({
      ...createDeliveryRequestDto,
      idClient: new Types.ObjectId(idClient),
      distance,
      tarif,
      dateHeureLimite: new Date(createDeliveryRequestDto.dateHeureLimite),
    });

    return await demandeCreation.save();
  }

  async findAll() {
    return await this.deliveryRequestModel
      .find()
      .populate('idClient')
      .populate('idLivreur');
  }

  async findById(id: string) {
    const demande = await this.deliveryRequestModel
      .findById(id)
      .populate('idClient')
      .populate('idLivreur');
    if (!demande) {
      throw new NotFoundException('Demande de livraison introuvable');
    }
    return demande;
  }

  async findByClientId(idClient: string) {
    return await this.deliveryRequestModel
      .find({ idClient: new Types.ObjectId(idClient) })
      .populate('idLivreur');
  }

  async findByDeliveryManId(idLivreur: string) {
    return await this.deliveryRequestModel
      .find({ idLivreur: new Types.ObjectId(idLivreur) })
      .populate('idClient');
  }

  async updateStatus(
    id: string,
    updateDeliveryRequestStatusDto: UpdateDeliveryRequestStatusDto,
  ) {
    const demande = await this.deliveryRequestModel.findById(id);
    if (!demande) {
      throw new NotFoundException('Demande de livraison introuvable');
    }

    const updateData: any = { statut: updateDeliveryRequestStatusDto.statut };
    if (updateDeliveryRequestStatusDto.statut === 'LIVREE') {
      updateData.dateLivraison = new Date();
    }

    const updated = await this.deliveryRequestModel.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
      },
    );
    return updated;
  }

  async cancelDelivery(id: string) {
    const demande = await this.deliveryRequestModel.findById(id);
    if (!demande) {
      throw new NotFoundException('Demande de livraison introuvable');
    }

    if (demande.statut === 'LIVREE') {
      throw new BadRequestException(
        'Impossible d\'annuler une livraison deja livree',
      );
    }

    if (demande.statut === 'ANNULEE') {
      throw new BadRequestException(
        'Cette livraison est deja annulee',
      );
    }

    const updated = await this.deliveryRequestModel.findByIdAndUpdate(
      id,
      { statut: 'ANNULEE' },
      { new: true },
    );
    return updated;
  }

  async assignToDeliveryMan(id: string, idLivreur: string) {
    const demande = await this.deliveryRequestModel.findById(id);
    if (!demande) {
      throw new NotFoundException('Demande de livraison introuvable');
    }

    if (demande.statut !== 'EN_ATTENTE') {
      throw new BadRequestException(
        'Seules les demandes en attente peuvent etre assignees',
      );
    }

    // Vérifier que le livreur existe et a le rôle LIVREUR
    const livreur = await this.usersService.findOne(idLivreur);
    if (livreur.role !== 'LIVREUR') {
      throw new BadRequestException(
        'Cet utilisateur n\'a pas le rôle de livreur',
      );
    }

    const updated = await this.deliveryRequestModel.findByIdAndUpdate(
      id,
      {
        idLivreur: new Types.ObjectId(idLivreur),
        statut: 'ASSIGNEE',
        dateAssignation: new Date(),
      },
      { new: true },
    );
    return updated;
  }

  async checkAndCancelExpired() {
    const now = new Date();
    const result = await this.deliveryRequestModel.updateMany(
      {
        dateHeureLimite: { $lt: now },
        statut: { $ne: 'LIVREE' },
      },
      { statut: 'ANNULEE' },
    );
    return result;
  }

  async getDeliveryManStats(idLivreur: string) {
    const deliveries = await this.deliveryRequestModel.find({
      idLivreur: new Types.ObjectId(idLivreur),
    });

    const livreed = deliveries.filter((d) => d.statut === 'LIVREE');
    const assigned = deliveries.filter((d) => d.statut === 'ASSIGNEE');
    const cancelled = deliveries.filter((d) => d.statut === 'ANNULEE');

    const totalEarnings = livreed.reduce((sum, d) => sum + d.tarif, 0);
    const totalDistance = livreed.reduce(
      (sum, d) => sum + (d.distance || 0),
      0,
    );

    return {
      totalLivered: livreed.length,
      totalAssigned: assigned.length,
      totalCancelled: cancelled.length,
      totalEarnings,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      averageEarningsPerDelivery:
        livreed.length > 0
          ? parseFloat((totalEarnings / livreed.length).toFixed(0))
          : 0,
    };
  }

  async getGlobalStats() {
    const allDeliveries = await this.deliveryRequestModel.find();
    const livreed = allDeliveries.filter((d) => d.statut === 'LIVREE');
    const pending = allDeliveries.filter((d) => d.statut === 'EN_ATTENTE');
    const assigned = allDeliveries.filter((d) => d.statut === 'ASSIGNEE');
    const cancelled = allDeliveries.filter((d) => d.statut === 'ANNULEE');

    const totalRevenue = livreed.reduce((sum, d) => sum + d.tarif, 0);
    const totalDistance = livreed.reduce(
      (sum, d) => sum + (d.distance || 0),
      0,
    );

    return {
      totalDeliveries: allDeliveries.length,
      delivered: livreed.length,
      pending: pending.length,
      assigned: assigned.length,
      cancelled: cancelled.length,
      totalRevenue,
      totalDistance: parseFloat(totalDistance.toFixed(2)),
      averageDeliveryPrice:
        livreed.length > 0
          ? parseFloat((totalRevenue / livreed.length).toFixed(0))
          : 0,
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleExpiredDeliveries() {
    try {
      const result = await this.checkAndCancelExpired();
      if (result.modifiedCount > 0) {
        console.log(
          `[CRON] ${result.modifiedCount} livraisons expirées annulées`,
        );
      }
    } catch (error) {
      console.error('[CRON] Erreur lors de la vérification des expirations:', error);
    }
  }
}
