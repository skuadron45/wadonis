import { DeviceRepository, BIND_KEY } from 'App/Repository/DeviceRepository';
import { WhatsappServerService } from 'App/Whatsappserver/WhatsappServerService';
import { WhatsappDevice } from 'App/WhatsappServer/WhatsappClient';

import Application from '@ioc:Adonis/Core/Application'
import BaseWhatsappClient from 'App/WhatsappServer/impl/BaseWhatsappClient';

class BaseWhatsappServerService implements WhatsappServerService {

    private booted = false;
    protected clients: { [deviceId: string]: BaseWhatsappClient } = {};

    public async boot() {

        if (this.booted) {
            return;
        }

        let deviceRepository = <DeviceRepository>Application.container.resolveBinding(BIND_KEY);
        let devices = await deviceRepository.findAll();

        devices.forEach((device) => {
            let whatsAppDevice: WhatsappDevice = {
                id: device.id,
                name: device.name
            }
            this.clients[device.id] = new BaseWhatsappClient(whatsAppDevice);
        });
        this.booted = true;
    }

    public getClient(deviceId: any): BaseWhatsappClient {
        return this.clients[deviceId] || null;
    }

}
export default BaseWhatsappServerService;
