import Application from '@ioc:Adonis/Core/Application';
import { DisconnectReason, ReconnectMode, WAChatUpdate, WAConnection } from '@adiwajshing/baileys';

import { WebSocketService, BIND_KEY, RequestQrResponse } from 'App/Websocket/WebSocketService';

import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import * as DeviceRepository from 'App/Repository/DeviceRepository';

export default class BaseWhatsappClient implements WhatsappClient {

    private conn = new WAConnection();

    private device: WhatsappDevice;
    private qrText: string | null;

    constructor(device: WhatsappDevice) {
        this.device = device;

        this.init();
    }

    public getDeviceId(): string {
        return this.device.id;
    }

    private init(): void {
        let websocketService = <WebSocketService>Application.container.resolveBinding(BIND_KEY);

        let deviceRepository = <DeviceRepository.DeviceRepository>Application.container.resolveBinding(DeviceRepository.BIND_KEY);

        this.conn.on('qr', (qr: string) => {
            console.log("QR Refreshed - device id: " + this.device.id);
            this.qrText = qr;

            let response: RequestQrResponse = {
                success: true,
                device: this.device,
                qrText: this.qrText
            }
            websocketService.emitTo("device-" + this.device.id, "qr-refreshed", response);
        });


        this.conn.on('open', async () => {
            console.log("Device id: " + this.device.id + " - " + "Open");

            this.qrText = null;
            const authInfo = this.conn.base64EncodedAuthInfo()
            const authInfoString = JSON.stringify(authInfo, null, '\t');
            console.log('Auth JSON: ' + authInfoString);

            await deviceRepository.updateSession(this.device.id, authInfo);
            websocketService.emitTo("device-" + this.device.id, "session-changed");
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
            if (chat.messages) {
                let messages = chat.messages;
                let all = chat.messages.all();
                console.log(all)
                console.log(messages.first)
                console.log(messages.last)
                console.log(messages.length)
            }

        });

        this.conn.on('close', async (err: { reason: DisconnectReason, isReconnecting: boolean }) => {
            console.log("Device id: " + this.device.id + " - " + "Disconnected");
            console.log('Reconnecting: ' + err.isReconnecting);

            if (err.isReconnecting === false) {

                await deviceRepository.updateSession(this.device.id, null);
                this.conn.clearAuthInfo();
                this.conn.connect();
            }
        });

        if (this.device.session) {
            let authInfo = JSON.parse(this.device.session);
            this.conn.loadAuthInfo(authInfo);
        }

        this.conn.logger.level = 'silent';
        this.conn.connectOptions.logQR = false;
        this.conn.autoReconnect = ReconnectMode.onAllErrors;
        this.conn.connect();
    }

    public getQrText(): string | null {
        return this.qrText;
    }

    public getDevice(): WhatsappDevice {
        return this.device;
    }
}