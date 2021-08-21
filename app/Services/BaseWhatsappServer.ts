import { WAConnection } from '@adiwajshing/baileys';

import Application from '@ioc:Adonis/Core/Application'
import { WhatsappServer } from "@ioc:App/WhatsappServer";

class WaManager {

    public conn = new WAConnection();

    public callback: (qr: string) => void = () => {

    };

    public initConnection() {
        // this.conn.connectOptions.logQR = false;        
        this.conn.on('open', () => {

        });
        this.conn.connect();
    }

    public onQr(callback: (qr: string) => void) {
        this.callback = callback;
        this.conn.on('qr', (qr: string) => {
            this.callback(qr);
        });
    }
}

class BaseWhatsappServer implements WhatsappServer {

    public async boot() {
        let Database = Application.container.make("Adonis/Lucid/Database");

        console.log("whatsapp server booted");
        let devices = await Database.query()
            .from('devices')
            .select('*');
    }

    public async test() {

    }
}
export default BaseWhatsappServer;
