import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CreateUnitDto, createUnitSchema } from './dto/create-unity.dto';
import { UnitEntity } from './entities/unity.entity';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { UpdateUnitDto } from './dto/update-unity.dto';
import { UnityService } from './unity.service';
import { uuidSchema } from 'src/resources/shared/dto/uuid.dto';
import { AuthMiddleware } from 'src/resources/middlewares';

@Controller('units')
export class UnityController {
  constructor(private readonly unitService: UnityService) {}

  // Criar uma nova unidade
  @UseGuards(AuthMiddleware)
  @Post()
  @UsePipes(new ZodValidationPipe(createUnitSchema)) // Usando o ZodValidationPipe
  async create(@Body() body: CreateUnitDto): Promise<UnitEntity> {
    return this.unitService.create(body);
  }

  // Buscar todas as unidades
  @UseGuards(AuthMiddleware)
  @Get()
  async findAll(
    @Req() req,
    @Query('search') search?: string,
  ): Promise<UnitEntity[]> {
    const companyId = req.auth.cId;

    return this.unitService.findAll(companyId, search);
  }

  // Buscar unidade por ID
  @UseGuards(AuthMiddleware)
  @Get(':id')
  async findOne(
    @Req() req,
    @Param('id', new ZodValidationPipe(uuidSchema)) id: string,
  ): Promise<UnitEntity> {
    const companyId = req.auth.cId;

    return this.unitService.findOne(id, companyId);
  }

  // Atualizar unidade
  @Patch(':id')
  @UseGuards(AuthMiddleware)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUnitDto,
  ): Promise<UnitEntity> {
    return this.unitService.update(id, body);
  }

  // Deletar unidade
  @Delete(':id')
  @UseGuards(AuthMiddleware)
  async remove(@Param('id') id: string): Promise<void> {
    return this.unitService.remove(id);
  }
}
