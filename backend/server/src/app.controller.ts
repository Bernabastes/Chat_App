import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly chat: ChatService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('rooms')
  listRooms() {
    return this.chat.listRooms();
  }

  @Get('rooms/:name/history')
  getHistory(@Param('name') name: string) {
    return this.chat.history(name, 100);
  }
}
