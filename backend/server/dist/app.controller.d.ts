import { AppService } from './app.service';
import { ChatService } from './chat/chat.service';
export declare class AppController {
    private readonly appService;
    private readonly chat;
    constructor(appService: AppService, chat: ChatService);
    getHello(): string;
    listRooms(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    getHistory(name: string): Promise<{
        id: string;
        room: string;
        username: string;
        content: string;
        createdAt: Date;
    }[]>;
}
