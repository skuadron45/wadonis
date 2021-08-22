import Application from '@ioc:Adonis/Core/Application'
import { WebsocketService, RequestQrResponse } from "@ioc:App/WebsocketService";
import { WhatsappServerService } from '@ioc:App/WhatsappServerService';

import { Server as SocketServer } from 'socket.io'

class BaseWebsocketService implements WebsocketService {

    private booted = false;
    private io: SocketServer

    private whatsappServer: WhatsappServerService;

    constructor() {
        this.whatsappServer = Application.container.make("App/WhatsappServerService");
    }

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
        this.io.on("connection", async (socket) => {

            socket.join("device-" + socket.handshake.query.deviceId);

            socket.on("request-qr", (deviceId: any, callback: (response: RequestQrResponse) => void) => {
                let client = this.whatsappServer.getClient(deviceId);
                let response = <RequestQrResponse>{
                    device: client.getDevice(),
                    qrText: client.getQrText()
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
export default BaseWebsocketService;
