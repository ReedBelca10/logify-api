import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
} from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import * as path from 'path';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/dishes');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

@ApiTags('Menu')
@ApiBearerAuth('access-token')
@Controller('menu')
export class MenuController {
  constructor(private menuService: MenuService) { }

  @ApiOperation({ summary: 'Récupérer la liste des plats' })
  @Get()
  async findAll() {
    return await this.menuService.findAll();
  }

  @ApiOperation({ summary: 'Récupérer un plat par id' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.menuService.findById(id);
  }

  @ApiOperation({ summary: 'Créer un plat (ADMIN uniquement)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async create(
    @Body() createDishDto: CreateDishDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/dishes/${file.filename}` : undefined;
    return await this.menuService.create({ ...createDishDto, imageUrl });
  }

  @ApiOperation({ summary: 'Mettre à jour un plat (ADMIN uniquement)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return await this.menuService.update(id, updateDishDto);
  }

  @ApiOperation({ summary: 'Supprimer un plat (ADMIN uniquement)' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.menuService.delete(id);
  }
}
