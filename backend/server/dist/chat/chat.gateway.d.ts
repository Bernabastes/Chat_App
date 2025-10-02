import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
export declare class ChatGateway {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleJoin(client: Socket, payload: {
        room: string;
        username: string;
    }): Promise<void>;
    handleMessage(client: Socket, payload: {
        room: string;
        username: string;
        content: string;
    }): Promise<void>;
}
