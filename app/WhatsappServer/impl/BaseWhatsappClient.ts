import Application from '@ioc:Adonis/Core/Application';

import { DisconnectReason, MessageType, ReconnectMode, WAChatUpdate, WAConnection, WAContact } from '@adiwajshing/baileys';
import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import { ServiceContext } from 'App/Whatsappserver/WhatsappServerService';

export default class BaseWhatsappClient implements WhatsappClient {

    private conn = new WAConnection();
    private device: WhatsappDevice;
    private qrText: string | null;
    private contacts: Partial<WAContact>[] = [];

    private deviceId: string;

    private context: ServiceContext;

    private alreadyOpen = false;

    constructor(context: ServiceContext, device: WhatsappDevice) {
        this.context = context;
        this.device = device;
        this.deviceId = device.id;

        setInterval(() => {
            if (this.alreadyOpen) {
                console.log("Cek connection with query, Device ID: " + this.deviceId);
                this.conn.query({ json: ['admin', 'test'], maxRetries: 1, timeoutMs: 5000 })
                    .then(async (response) => {
                        console.log(response);
                        await this.context.setPhoneConnected(this.deviceId, 1);
                    }).catch(async (e) => {
                        console.log("Fail: ", e);
                        await this.context.setPhoneConnected(this.deviceId, 0);
                    });
            }
        }, 10000);
    }

    public getDevice(): WhatsappDevice {
        return this.device;
    }

    public getQrText(): string | null {
        return this.qrText;
    }

    public async sendMessage(phone: string, message: string) {
        let type = MessageType.text;
        await this.conn.sendMessage(phone + "@s.whatsapp.net", message, type);
    }

    public async getContacts(): Promise<any> {
        return this.contacts;
    }

    public async connect(): Promise<void> {

        this.initListener();

        if (this.device.session) {
            let authInfo = JSON.parse(this.device.session);
            this.conn.loadAuthInfo(authInfo);
        }

        this.conn.browserDescription = ["Ryp Whatsapp", "Chrome", "1.0.0"];
        this.conn.logger.level = 'error';
        this.conn.connectOptions.logQR = false;
        this.conn.autoReconnect = ReconnectMode.onAllErrors;
        this.conn.setMaxListeners(0);
        this.conn.connect();
    }

    public async reconnect(): Promise<void> {
        this.conn.clearAuthInfo();
        this.conn.connect();
    }

    private initListener(): void {
        let logger = Application.container.resolveBinding("Adonis/Core/Logger");

        this.conn.on('connecting', async () => {
            logger.info("Device id: " + this.deviceId + " - " + "Connecting");

            await this.context.clientConnecting(this.deviceId);
        });

        this.conn.on('qr', (qr: string) => {
            this.qrText = qr;

            logger.info("Device id: " + this.device.id + " - " + "QR Refreshed");
        });

        this.conn.on('open', async () => {
            this.alreadyOpen = true;
            this.qrText = null;
            logger.info("Device id: " + this.device.id + " - " + "Open");

            const authInfo = this.conn.base64EncodedAuthInfo();
            await this.context.clientOpened(this.device.id, authInfo);
        });

        this.conn.on('connection-phone-change', async (state: { connected: boolean }) => {
            logger.info("Device id: " + this.device.id + " - " + "Phone connected: " + state.connected);

            if (state.connected === false) {
                await this.context.setPhoneConnected(this.deviceId, 0);
            } else {
                await this.context.setPhoneConnected(this.deviceId, 1);
            }
        });

        this.conn.on('close', async (err: { reason: DisconnectReason, isReconnecting: boolean }) => {
            logger.info("Device id: " + this.device.id + " - " + "Disconnected");
            logger.info('Reconnecting: ' + err.isReconnecting);

            await this.context.clientClosed(this.deviceId, err.isReconnecting);
        });

        this.conn.on('contacts-received', async (update) => {
            let contacts = update.updatedContacts;
            this.contacts.push(...contacts);

            logger.info("Device id: " + this.device.id + " - " + "Contacts Received");
        });

        this.conn.on('CB:action,,battery', json => {
            const batteryLevelStr = json[2][0][1].value
            const batterylevel = parseInt(batteryLevelStr)

            logger.info("Device id: " + this.device.id + " - " + "Baterai Update: " + batterylevel);
        })

        this.conn.on('chat-update', (chat: WAChatUpdate) => {
            logger.info("Device id: " + this.device.id + " - " + "Chat update");
            if (chat) {

            }
        });

    }

}