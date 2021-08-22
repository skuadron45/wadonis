import Application from '@ioc:Adonis/Core/Application';
import { DisconnectReason, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';

import SocketServer from 'socket.io'

import { WhatsappClient, Device } from 'Contracts/WhatsappServerService';
import { WebsocketService } from 'Contracts/WebsocketService';

export default class BaseWhatsappClient implements WhatsappClient {

    private conn = new WAConnection();

    private device: Device;
    private qrText: string;

    constructor(device: Device) {
        this.device = <Device>{
            id: device.id,
            name: device.name
        }
        this.init();
    }

    public getDeviceId(): string {
        return this.device.id;
    }

    private init(): void {
        let websocketService = <WebsocketService>Application.container.make("App/WebsocketService");
        let io = <SocketServer.Server>websocketService.getIo();

        this.conn.on('qr', (qr: string) => {
            this.qrText = qr;

            io.to("device-" + this.device.id).emit("qr-refreshed", qr);

            console.log("QR Refreshed - device id: " + this.device.id + " : " + qr);
        });
        this.conn.on('open', () => {
            console.log("Device id: " + this.device.id + " - " + "Open");

            const authInfo = this.conn.base64EncodedAuthInfo()
            console.log('Auth JSON: ' + JSON.stringify(authInfo, null, '\t'));
        });

        this.conn.on('CB:action,,battery', json => {
            console.log("Device id: " + this.device.id + " - " + "baterai update");

            const batteryLevelStr = json[2][0][1].value
            const batterylevel = parseInt(batteryLevelStr)
            console.log('Battery level: ' + batterylevel)
        })

        this.conn.on('chat-update', (chat: WAChatUpdate) => {
            console.log("Device id: " + this.device.id + " - " + "Chat update");

            console.log(chat);
        });

        this.conn.on('close', (err: { reason: DisconnectReason, isReconnecting: boolean }) => {
            console.log("Device id: " + this.device.id + " - " + "Disconnected");
            console.log('Reconnecting: ' + err.isReconnecting);
        });

        this.conn.logger.level = 'info';
        this.conn.connectOptions.logQR = false;
        this.conn.connect();
    }

    public getQrText(): string {
        return this.qrText;
    }

    public getDevice(): Device {
        return this.device;
    }
}