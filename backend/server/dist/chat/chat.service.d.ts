import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    ensureUser(username: string): Promise<{
        id: string;
        username: string;
        createdAt: Date;
    }>;
    ensureRoom(name: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }>;
    addMember(roomName: string, username: string): Promise<void>;
    saveMessage(roomName: string, username: string, content: string): Promise<{
        id: string;
        room: string;
        username: string;
        content: string;
        createdAt: Date;
    }>;
    listRooms(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
    }[]>;
    history(roomName: string, limit?: number): Promise<{
        id: string;
        room: string;
        username: string;
        content: string;
        createdAt: Date;
    }[]>;
}
