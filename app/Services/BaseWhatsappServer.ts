
import Application from '@ioc:Adonis/Core/Application'
import { WhatsappServer } from "@ioc:App/WhatsappServer";
import WhatsappClient from './WhatsappClient';

class BaseWhatsappServer implements WhatsappServer {

    private booted = false;
    protected clients: { [deviceId: string]: WhatsappClient } = {};

    public async boot() {

        if (this.booted) {
            return;
        }
        let Database = Application.container.make("Adonis/Lucid/Database");
        let devices = await Database.query()
            .from('devices')
            .select('*');
        devices.forEach(device => {
            this.clients[device.id] = new WhatsappClient(device);
        });
        this.booted = true;
    }

    public getClient(deviceId: any): WhatsappClient {
        return this.clients[deviceId];
    }


}
export default BaseWhatsappServer;
