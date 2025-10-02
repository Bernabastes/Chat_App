import { IoAdapter } from '@nestjs/platform-socket.io';
import type { INestApplicationContext } from '@nestjs/common';
import type { ServerOptions } from 'socket.io';
import type { Redis } from 'ioredis';
export declare class RedisIoAdapter extends IoAdapter {
    private readonly pubClient;
    private readonly subClient;
    private adapterConstructor;
    constructor(app: INestApplicationContext, pubClient: Redis, subClient: Redis);
    createIOServer(port: number, options?: ServerOptions): any;
}
