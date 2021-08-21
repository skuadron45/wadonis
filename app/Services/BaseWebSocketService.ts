import Application from '@ioc:Adonis/Core/Application'
import { WebsocketService } from "@ioc:App/WebsocketService";

import { Server as SocketServer } from 'socket.io'

class BaseWebsocketService implements WebsocketService {

    private booted = false;
    private io: SocketServer

    public async boot() {
        if (this.booted) {
            console.log("socket server already booted!");
            return;
        }

        let Server = Application.container.make("Adonis/Core/Server");

        this.io = new SocketServer(Server.instance!);
        this.io.on("connection", (socket) => {

            socket.on("request-qr", (callback: (socketId: string) => void) => {
                callback(socket.id)
            });

        });
        this.booted = true;
        console.log("socket server booted!");
    }

}
export default BaseWebsocketService;
