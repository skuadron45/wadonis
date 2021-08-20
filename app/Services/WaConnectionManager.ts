import { WAConnection } from '@adiwajshing/baileys';

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

let manager = new WaManager();
manager.initConnection();

export default manager;