import { WhatsappClient } from "App/WhatsappServer/WhatsappClient";

export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

}