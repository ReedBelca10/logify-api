import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryRequestsController } from './delivery-requests.controller';
import { DeliveryRequestsService } from './delivery-requests.service';
import { DeliveryRequest, DeliveryRequestSchema } from './schemas/delivery-request.schema';
import { PricingService } from '../common/services/pricing.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DeliveryRequest.name, schema: DeliveryRequestSchema },
    ]),
    UsersModule,
  ],
  controllers: [DeliveryRequestsController],
  providers: [DeliveryRequestsService, PricingService],
  exports: [DeliveryRequestsService],
})
export class DeliveryRequestsModule {}
