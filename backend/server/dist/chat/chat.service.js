"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureUser(username) {
        return this.prisma.user.upsert({
            where: { username },
            update: {},
            create: { username },
        });
    }
    async ensureRoom(name) {
        return this.prisma.room.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    async addMember(roomName, username) {
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
    async saveMessage(roomName, username, content) {
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
    async history(roomName, limit = 50) {
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
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map