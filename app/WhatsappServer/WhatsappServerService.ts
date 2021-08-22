import { WhatsappClient } from "App/WhatsappServer/WhatsappClient";

export const BIND_KEY = "App/WhatsappServer/WhatsappServerService";

export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

}