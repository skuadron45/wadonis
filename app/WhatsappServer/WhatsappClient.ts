export type WhatsappDevice = {
    id: string,
    name: string
}

export interface WhatsappClient {

    getDevice(): WhatsappDevice;
    getDeviceId(): string;
    getQrText(): string;

}