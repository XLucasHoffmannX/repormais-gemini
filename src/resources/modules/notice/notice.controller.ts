import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { AuthMiddleware } from 'src/resources/middlewares';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @UseGuards(AuthMiddleware)
  @Get()
  async getNotices() {
    return this.noticeService.getNotices();
  }

  @UseGuards(AuthMiddleware)
  @Post('/generate')
  async generateNotices() {
    return this.noticeService.generateNotices();
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
