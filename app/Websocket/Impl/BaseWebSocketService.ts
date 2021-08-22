import Application from '@ioc:Adonis/Core/Application'

import { Server as SocketServer } from 'socket.io'
import { RequestQrResponse, WebSocketService } from '../WebSocketService';

class BaseWebSocketService implements WebSocketService {

    private booted = false;
    private io: SocketServer

    public async boot() {
        if (this.booted) {
            console.log("socket server already booted!");
            return;
        }
        let Server = Application.container.make("Adonis/Core/Server");
        this.io = new SocketServer(Server.instance!);
        this.booted = true;

        this.initListener();
    }

    private initListener() {
        let whatsappServer = Application.container.resolveBinding("App/WhatsappServerService");

        this.io.on("connection", async (socket) => {

            socket.join("device-" + socket.handshake.query.deviceId);

            socket.on("request-qr", (deviceId: any, callback: (response: RequestQrResponse) => void) => {

                let response: RequestQrResponse = {
                    success: false
                }

                let client = whatsappServer.getClient(deviceId);
                if (client) {
                    response.success = true;
                    response.device = client.getDevice();
                    response.qrText = client.getQrText();
                }

                callback(response);
            });

            // let sockets = await this.io.allSockets();
            // console.log(socket.id);
            // console.log(socket.rooms);
        });
    }

    public getIo() {
        return this.io;
    }

}
export default BaseWebSocketService;