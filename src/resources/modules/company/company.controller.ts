import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import {
  createCompanySchema,
  CreateCompanyDto,
} from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { AuthMiddleware } from 'src/resources/middlewares';

@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(AuthMiddleware)
  @Post()
  @UsePipes(new ZodValidationPipe(createCompanySchema))
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @UseGuards(AuthMiddleware)
  @Get()
  findAll() {
    return this.companyService.findAll();
  }

  @UseGuards(AuthMiddleware)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @UseGuards(AuthMiddleware)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(id, updateCompanyDto);
  }

  @UseGuards(AuthMiddleware)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(id);
  }
}
