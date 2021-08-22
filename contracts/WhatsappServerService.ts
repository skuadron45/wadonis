export type Device = {
    id: string,
    name: string
}

export interface WhatsappClient {

    getDeviceId(): string;
    getDevice(): Device;
    getQrText(): string;

}

export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

}