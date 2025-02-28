import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { AuthMiddleware } from 'src/resources/middlewares';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(AuthMiddleware)
  @Get()
  async getNotices(@Req() req) {
    const companyId = req.auth.cId;

    return this.noticeService.getNotices(companyId);
  }

  @UseGuards(AuthMiddleware)
  @Post('/generate')
  async generateNotices(@Req() req) {
    const companyId = req.auth.cId;
    return this.noticeService.generateNotices(companyId);
  }

  @UseGuards(AuthMiddleware)
  @Post('/resolve/:id')
  async resolveNotice(@Param('id') id: string) {
    return this.noticeService.resolveNotice(id);
  }

  @UseGuards(AuthMiddleware)
  @Post('/resolve-all')
  async resolveAllNotices() {
    return this.noticeService.resolveAllNotices();
  }
}
