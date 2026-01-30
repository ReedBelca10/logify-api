import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { MenuModule } from './menu/menu.module';
import { DeliveryRequestsModule } from './delivery-requests/delivery-requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food_delivery',
      }),
      inject: [],
    }),
    AuthModule,
    UsersModule,
    OrdersModule,
    DeliveriesModule,
    MenuModule,
    DeliveryRequestsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

