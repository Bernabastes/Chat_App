import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureUser(username: string) {
    return this.prisma.user.upsert({
      where: { username },
      update: {},
      create: { username },
    });
  }

  async ensureRoom(name: string) {
    return this.prisma.room.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  async addMember(roomName: string, username: string) {
    const [room, user] = await Promise.all([
      this.prisma.room.findUniqueOrThrow({ where: { name: roomName } }),
      this.prisma.user.findUniqueOrThrow({ where: { username } }),
    ]);
    await this.prisma.roomMember.upsert({
      where: { roomId_userId: { roomId: room.id, userId: user.id } },
      update: {},
      create: { roomId: room.id, userId: user.id },
    });
  }

  async saveMessage(roomName: string, username: string, content: string) {
    const [room, user] = await Promise.all([
      this.prisma.room.findUniqueOrThrow({ where: { name: roomName } }),
      this.prisma.user.findUniqueOrThrow({ where: { username } }),
    ]);
    const saved = await this.prisma.message.create({
      data: { roomId: room.id, userId: user.id, content },
      include: { user: true },
    });
    return {
      id: saved.id,
      room: room.name,
      username: saved.user.username,
      content: saved.content,
      createdAt: saved.createdAt,
    };
  }

  async listRooms() {
    return this.prisma.room.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async history(roomName: string, limit = 50) {
    const room = await this.prisma.room.findUniqueOrThrow({ where: { name: roomName } });
    const messages = await this.prisma.message.findMany({
      where: { roomId: room.id },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: { user: true },
    });
    return messages.map(m => ({
      id: m.id,
      room: room.name,
      username: m.user.username,
      content: m.content,
      createdAt: m.createdAt,
    }));
  }
}



