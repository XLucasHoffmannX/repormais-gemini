import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { WithdrawDto, withdrawSchema } from './dto/create-withdraw.dto';
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { AuthMiddleware } from 'src/resources/middlewares';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @UseGuards(AuthMiddleware)
  @Post()
  @UsePipes(new ZodValidationPipe(withdrawSchema))
  async createWithdraw(@Body() data: WithdrawDto) {
    return this.withdrawService.createWithdraw(data);
  }

  @UseGuards(AuthMiddleware)
  @Get()
  async getAllWithdraws(
    @Req() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const companyId = req.auth.cId;

    return this.withdrawService.findAll(
      companyId,
      { page, limit, route: `${req.protocol}://${req.get('host')}/withdraws` },
      { type, startDate, endDate, search },
    );
  }

  @UseGuards(AuthMiddleware)
  @Get(':productId')
  async getWithdrawsByProduct(
    @Req() req,
    @Param('productId') productId: string,
  ) {
    const companyId = req.auth.cId;

    return this.withdrawService.findByProduct(productId, companyId);
  }
}
