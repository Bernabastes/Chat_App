"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisIoAdapter = void 0;
const platform_socket_io_1 = require("@nestjs/platform-socket.io");
const redis_adapter_1 = require("@socket.io/redis-adapter");
class RedisIoAdapter extends platform_socket_io_1.IoAdapter {
    pubClient;
    subClient;
    adapterConstructor = null;
    constructor(app, pubClient, subClient) {
        super(app);
        this.pubClient = pubClient;
        this.subClient = subClient;
    }
    createIOServer(port, options) {
        const server = super.createIOServer(port, {
            cors: { origin: '*' },
            ...options,
        });
        server.adapter((0, redis_adapter_1.createAdapter)(this.pubClient, this.subClient));
        return server;
    }
}
exports.RedisIoAdapter = RedisIoAdapter;
//# sourceMappingURL=redis-io.adapter.js.map