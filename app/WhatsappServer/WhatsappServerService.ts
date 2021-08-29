import { WhatsappClient } from "App/WhatsappServer/WhatsappClient";

export const BIND_KEY = "App/WhatsappServer/WhatsappServerService";

export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient | null;

}

export interface ServiceContext {

    clientConnecting(deviceId: string): Promise<void>;

    clientClosed(deviceId: string, isReconnecting: boolean, reason?: string): Promise<void>;

    clientOpened(deviceId: string, authInfo: any): Promise<void>;

    setPhoneConnected(deviceId: string, status: number): Promise<void>;

}