import Application from '@ioc:Adonis/Core/Application';
import { DisconnectReason, MessageType, ReconnectMode, WAChatUpdate, WAConnection, WAContact } from '@adiwajshing/baileys';

// import { WebSocketService, BIND_KEY, RequestQrResponse } from 'App/Websocket/WebSocketService';

import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import * as DeviceRepository from 'App/Repository/DeviceRepository';

export default class BaseWhatsappClient implements WhatsappClient {

    private conn = new WAConnection();

    private device: WhatsappDevice;
    private qrText: string | null;

    private contacts: Partial<WAContact>[] = [];

    constructor(device: WhatsappDevice) {
        this.device = device;

        this.init();
    }

    public async sendMessage(phone: string, message: string) {

        let type = MessageType.text;
        await this.conn.sendMessage(phone + "@s.whatsapp.net", message, type);
    }

    public async getContacts(): Promise<any> {
        return this.contacts;
    }

    public getDeviceId(): string {
        return this.device.id;
    }

    private init(): void {
        let deviceRepository = <DeviceRepository.DeviceRepository>Application.container.resolveBinding(DeviceRepository.BIND_KEY);
        this.conn.on('qr', (qr: string) => {
            this.qrText = qr;

            console.log("QR Refreshed - device id: " + this.device.id);
            // let response: RequestQrResponse = {
            //     success: true,
            //     device: this.device,
            //     qrText: this.qrText
            // }
            // websocketService.emitTo("device-" + this.device.id, "qr-refreshed", response);
        });

        this.conn.on('open', async () => {
            this.qrText = null;
            const authInfo = this.conn.base64EncodedAuthInfo()
            // const authInfoString = JSON.stringify(authInfo, null, '\t');
            await deviceRepository.updateSession(this.device.id, authInfo);

            console.log("Device id: " + this.device.id + " - " + "Open");

            // console.log('Auth JSON: ' + authInfoString);
            // websocketService.emitTo("device-" + this.device.id, "session-changed");
        });

        this.conn.on('contacts-received', async (update) => {
            let contacts = update.updatedContacts;
            this.contacts.push(...contacts);

            console.log("Device id: " + this.device.id + " - " + "Contacts Received");

            // console.log(u.updatedContacts);
        });

        this.conn.on('CB:action,,battery', json => {
            const batteryLevelStr = json[2][0][1].value
            const batterylevel = parseInt(batteryLevelStr)

            console.log("Device id: " + this.device.id + " - " + "baterai update: " + batterylevel);
        })

        this.conn.on('chat-update', (chat: WAChatUpdate) => {
            console.log("Device id: " + this.device.id + " - " + "Chat update");

            if (chat.messages) {
                // let messages = chat.messages;
                // let all = chat.messages.all();
                // console.log(all)
                // console.log(messages.first)
                // console.log(messages.last)
                // console.log(messages.length)
            }

            // websocketService.emitTo("device-" + this.device.id, "chat-update", whatsappID(this.conn.user.jid), chat);
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

        this.conn.browserDescription = ["Ryp Whatsapp", "Chrome", "1.0.0"];
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