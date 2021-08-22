import WhatsappServerService from 'App/Whatsappserver/WhatsappServerService';

import Application from '@ioc:Adonis/Core/Application'
import { Device } from 'App/WhatsappServer/WhatsappClient';
import BaseWhatsappClient from 'App/WhatsappServer/impl/BaseWhatsappClient';

class BaseWhatsappServerService implements WhatsappServerService {

    private booted = false;
    protected clients: { [deviceId: string]: BaseWhatsappClient } = {};

    public async boot() {

        if (this.booted) {
            return;
        }        

        let Database = Application.container.resolveBinding("Adonis/Lucid/Database");
        let rows = await Database.query()
            .from('devices')
            .select('*');

        let devices = rows.map((row) => {
            let device: Device = {
                id: row.id,
                name: row.name
            }
            return device;
        });
        devices.forEach(device => {
            this.clients[device.id] = new BaseWhatsappClient(device);
        });
        this.booted = true;
    }

    public getClient(deviceId: any): BaseWhatsappClient {
        return this.clients[deviceId] || null;
    }

}
export default BaseWhatsappServerService;
