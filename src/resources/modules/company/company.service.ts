import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const newCompany = this.companyRepository.create(createCompanyDto);
      return await this.companyRepository.save(newCompany);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      return await this.companyRepository.find({
        relations: ['users', 'stores'],
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const company = await this.companyRepository.findOne({
        where: { id },
        relations: ['users', 'stores'],
      });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      return company;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.companyRepository.update(id, updateCompanyDto);
      return await this.companyRepository.findOne({ where: { id } });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: string) {
    try {
      const company = await this.companyRepository.findOne({ where: { id } });

      if (!company) {
        throw new HttpException('Empresa não encontrada', HttpStatus.NOT_FOUND);
      }

      await this.companyRepository.delete(id);
      return { message: 'Empresa removida com sucesso' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
