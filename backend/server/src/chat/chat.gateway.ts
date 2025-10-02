import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; username: string }
  ): Promise<void> {
    const { room, username } = payload;
    await this.chatService.ensureUser(username);
    await this.chatService.ensureRoom(room);
    await this.chatService.addMember(room, username);
    await client.join(room);
    client.emit('joined', { room });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; username: string; content: string }
  ): Promise<void> {
    const { room, username, content } = payload;
    const message = await this.chatService.saveMessage(room, username, content);
    this.server.to(room).emit('message', message);
  }
}



