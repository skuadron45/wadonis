import Application from '@ioc:Adonis/Core/Application';

import { DisconnectReason, MessageType, ReconnectMode, WAChatUpdate, WAConnection, WAContact } from '@adiwajshing/baileys';
import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import { DeviceRepository, BIND_KEY } from 'App/Repository/DeviceRepository';

export default class BaseWhatsappClient implements WhatsappClient {

    private conn = new WAConnection();
    private device: WhatsappDevice;
    private qrText: string | null;
    private contacts: Partial<WAContact>[] = [];

    private deviceRepository: DeviceRepository;

    constructor(device: WhatsappDevice) {
        this.device = device;
        this.deviceRepository = Application.container.resolveBinding(BIND_KEY);
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
        this.conn.logger.level = 'silent';
        this.conn.connectOptions.logQR = false;
        this.conn.autoReconnect = ReconnectMode.onAllErrors;
        this.conn.connect();
    }

    private initListener(): void {
        let logger = Application.container.resolveBinding("Adonis/Core/Logger");
        this.conn.on('qr', (qr: string) => {
            this.qrText = qr;

            logger.info("Device id: " + this.device.id + " - " + "QR Refreshed");
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
            await this.deviceRepository.updateSession(this.device.id, authInfo);

            logger.info("Device id: " + this.device.id + " - " + "Open");

            // console.log('Auth JSON: ' + authInfoString);
            // websocketService.emitTo("device-" + this.device.id, "session-changed");
        });

        this.conn.on('contacts-received', async (update) => {
            let contacts = update.updatedContacts;
            this.contacts.push(...contacts);

            logger.info("Device id: " + this.device.id + " - " + "Contacts Received");
            // console.log(u.updatedContacts);
        });

        this.conn.on('CB:action,,battery', json => {
            const batteryLevelStr = json[2][0][1].value
            const batterylevel = parseInt(batteryLevelStr)

            logger.info("Device id: " + this.device.id + " - " + "baterai update: " + batterylevel);
        })

        this.conn.on('chat-update', (chat: WAChatUpdate) => {
            logger.info("Device id: " + this.device.id + " - " + "Chat update");
            if (chat) {

            }
        });

        this.conn.on('close', async (err: { reason: DisconnectReason, isReconnecting: boolean }) => {
            logger.info("Device id: " + this.device.id + " - " + "Disconnected");
            logger.info('Reconnecting: ' + err.isReconnecting);

            if (err.isReconnecting === false) {

                await this.deviceRepository.updateSession(this.device.id, null);
                this.conn.clearAuthInfo();
                this.conn.connect();
            }
        });
    }


}