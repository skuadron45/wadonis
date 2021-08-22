import WhatsappClient from "App/WhatsappServer/WhatsappClient";

export default interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

}