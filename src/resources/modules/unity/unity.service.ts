import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnitEntity } from './entities/unity.entity';
import { CreateUnitDto } from './dto/create-unity.dto';
import { UpdateUnitDto } from './dto/update-unity.dto';
import { validate as isUUID } from 'uuid';
import { CompanyEntity } from '../company/entities/company.entity';

@Injectable()
export class UnityService {
  constructor(
    @InjectRepository(UnitEntity)
    private unitRepository: Repository<UnitEntity>,

    @InjectRepository(CompanyEntity)
    private companyRepository: Repository<CompanyEntity>,
  ) {}

  // Criar uma nova unidade
  async create(createUnitDto: CreateUnitDto): Promise<UnitEntity> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: createUnitDto.companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      const unit = this.unitRepository.create({
        ...createUnitDto,
        company: company,
      });

      return this.unitRepository.save({ ...unit });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Buscar todas as unidades
  async findAll(companyId: string): Promise<UnitEntity[]> {
    try {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      return this.unitRepository.find({
        where: { company: { id: companyId } },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  async findOne(id: string, companyId: string): Promise<UnitEntity> {
    try {
      if (!isUUID(id)) {
        throw new BadRequestException(`ID inválido: ${id}`);
      }

      // Verifica se a empresa existe
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      // Busca a unidade dentro da empresa correta
      const unit = await this.unitRepository.findOne({
        where: { id: id, company: { id: companyId } }, // Correção aqui
      });

      if (!unit) {
        throw new NotFoundException(
          `Unidade com id ${id} não encontrada para esta empresa`,
        );
      }

      return unit;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Atualizar unidade
  async update(id: string, updateUnitDto: UpdateUnitDto): Promise<UnitEntity> {
    try {
      const unit = await this.unitRepository.preload({
        id,
        ...updateUnitDto,
      });

      if (!unit) {
        throw new NotFoundException(`Unidade com id ${id} não encontrada`);
      }

      return this.unitRepository.save(unit);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Deletar unidade
  async remove(id: string): Promise<void> {
    const unit = await this.unitRepository.findOne({ where: { id } });
    await this.unitRepository.remove(unit);
  }
}
