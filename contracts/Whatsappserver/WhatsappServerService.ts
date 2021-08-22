export type Device = {
    id: string,
    name: string
}

export interface WhatsappClient {

    getQrText(): string;
    getDevice(): Device;
}

export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

}