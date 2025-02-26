import { ZodValidationPipe } from 'src/resources/shared/pipes';
import { WithdrawDto, withdrawSchema } from './dto/create-withdraw.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
  async getAllWithdraws(@Req() req) {
    const companyId = req.auth.cId;

    return this.withdrawService.findAll(companyId);
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
