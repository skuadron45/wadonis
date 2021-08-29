import { DeviceRepository, BIND_KEY } from 'App/Repository/DeviceRepository';
import { WhatsappServerService, ServiceContext } from 'App/Whatsappserver/WhatsappServerService';
import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import { ClientStore, BIND_KEY as CLIENT_STORE_BIND_KEY } from 'App/Whatsappserver/ClientStore';

import Application from '@ioc:Adonis/Core/Application'
import BaseWhatsappClient from 'App/WhatsappServer/impl/BaseWhatsappClient';

class BaseWhatsappServerService implements WhatsappServerService, ServiceContext {

    private booted = false;

    private deviceRepository: DeviceRepository;
    private clientStore: ClientStore;

    constructor() {
        this.clientStore = Application.container.resolveBinding(CLIENT_STORE_BIND_KEY);
        this.deviceRepository = Application.container.resolveBinding(BIND_KEY);
    }

    public async boot() {
        if (this.booted) {
            return;
        }

        let devices = await this.deviceRepository.findAll();
        devices.forEach(async (device) => {
            try {
                let whatsAppDevice: WhatsappDevice = {
                    id: device.id,
                    name: device.name,
                    session: device.data.session
                }
                let client = new BaseWhatsappClient(this, whatsAppDevice);
                await client.connect();

                this.clientStore.add(device.id, client);
            } catch (error) {
                // nothing todo
            }
        });
        this.booted = true;
    }

    public getClient(deviceId: any): WhatsappClient | null {

        let client = this.clientStore.get(deviceId);

        return client;
    }

    public async clientConnecting(deviceId: string) {
        await this.setPhoneConnected(deviceId, 0);
    }

    public async clientOpened(deviceId: string, authInfo: any) {

        await this.setPhoneConnected(deviceId, 1);
        await this.deviceRepository.updateSession(deviceId, authInfo);
    }

    public async clientClosed(deviceId: string, isReconnecting: boolean) {

        await this.setPhoneConnected(deviceId, 0);
        if (isReconnecting === false) {
            await this.deviceRepository.updateSession(deviceId, null);
        }
    }

    public async setPhoneConnected(deviceId: string, status: number) {
        await this.deviceRepository.updateStatus(deviceId, status);
    }

}
export default BaseWhatsappServerService;
