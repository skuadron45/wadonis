import { WebsocketService } from "@ioc:App/WebsocketService";

import { Server } from 'socket.io'

class BaseWebsocketService implements WebsocketService {

    private io: Server

    public boot(server: any) {
        this.io = new Server(server)
        this.io.on("connection", (socket) => {

            socket.on("request-qr", (callback: (socketId: string) => void) => {
                callback(socket.id)
            });
        });
    }

    public emit(event: string, ...args: any[]) {
        this.io.emit(event, ...args);
    }

}
export default BaseWebsocketService;
