import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  createCompanySchema,
  CreateCompanyDto,
} from './dto/create-company.dto';
import {
  updateCompanySchema,
  UpdateCompanyDto,
} from './dto/update-company.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateCompanySchema))
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
