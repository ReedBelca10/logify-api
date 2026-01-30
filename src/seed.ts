import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  try {
    const existingAdmin = await usersService.findByEmail('admin@delivery.tg');

    if (existingAdmin) {
      console.log('Un ADMIN existe deja');
      await app.close();
      return;
    }

    const adminData = {
      name: 'Admin Delivery',
      email: 'admin@delivery.tg',
      password: '@dmin;2@@5',
      role: 'ADMIN',
      phoneNumber: '+228 96 79 60 72',
      latitude: 6.1252,
      longitude: 1.2317,
    };

    const createUserDto = new CreateUserDto();
    createUserDto.name = adminData.name;
    createUserDto.email = adminData.email;
    createUserDto.password = adminData.password;
    createUserDto.phoneNumber = adminData.phoneNumber;
    createUserDto.role = adminData.role as any;
    const admin = await usersService.create(createUserDto);
    console.log('ADMIN cree avec succes !');
    console.log('Email: admin@delivery.tg');
    console.log('Mot de passe: @dmin;2@@5');
    console.log(admin);

    await app.close();
  } catch (error) {
    console.error('Erreur lors du seed:', error);
    await app.close();
  }
}

bootstrap().catch((err) => console.error('Erreur du seed:', err));
