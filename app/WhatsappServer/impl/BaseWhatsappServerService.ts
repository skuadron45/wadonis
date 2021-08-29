import { DeviceRepository, BIND_KEY } from 'App/Repository/DeviceRepository';
import { WhatsappServerService } from 'App/Whatsappserver/WhatsappServerService';
import { WhatsappClient, WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import { ClientStore, BIND_KEY as CLIENT_STORE_BIND_KEY } from 'App/Whatsappserver/ClientStore';

import Application from '@ioc:Adonis/Core/Application'
import BaseWhatsappClient from 'App/WhatsappServer/impl/BaseWhatsappClient';

class BaseWhatsappServerService implements WhatsappServerService {

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
                let client = new BaseWhatsappClient(whatsAppDevice);
                await client.connect();

                this.clientStore.add(device.id, client);
            } catch (error) {
                // nothing todo
            }
        });
        this.booted = true;
    }

    public getClient(deviceId: any): WhatsappClient | null {
        return this.clientStore.get(deviceId);
    }

}
export default BaseWhatsappServerService;
