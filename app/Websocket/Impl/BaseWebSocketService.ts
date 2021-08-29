import Application from '@ioc:Adonis/Core/Application'

import { Server as SocketServer } from 'socket.io'
import { WebSocketService, RequestQrResponse } from 'App/Websocket/WebSocketService';

import { WhatsappServerService, BIND_KEY } from "App/WhatsappServer/WhatsappServerService";

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

        let whatsappServer = <WhatsappServerService>Application.container.resolveBinding(BIND_KEY);
        this.io.on("connection", async (socket) => {

            if (socket.handshake.query.deviceId) {
                socket.join("device-" + socket.handshake.query.deviceId);
            }

            socket.on("send-message", async (deviceId: any, data: any, callback: (data: any) => void) => {

                let client = whatsappServer.getClient(deviceId);
                if (client) {
                    await client.sendMessage(data.phone, data.message);
                    callback("terkirim");
                }
            });

            socket.on("load-contact", async (deviceId: any, callback: (data: any) => void) => {

                let client = whatsappServer.getClient(deviceId);
                if (client) {
                    let contacts = await client.getContacts();
                    callback(contacts);
                }

            });

            socket.on("request-qr", (deviceId: any, callback: (response: RequestQrResponse) => void) => {

                let response: RequestQrResponse = {
                    success: false
                }

                let client = whatsappServer.getClient(deviceId);
                if (client) {

                    let qrText = client.getQrText();
                    if (qrText) {
                        response.success = true;
                        response.device = client.getDevice();
                        response.qrText = client.getQrText();
                    }
                }
                callback(response);
            });

        });
    }

    public emitTo(room: string, event: string, ...args: any[]) {
        this.io.to(room).emit(event, ...args)
    }

}
export default BaseWebSocketService;