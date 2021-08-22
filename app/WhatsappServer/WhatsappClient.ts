export type WhatsappDevice = {
    id: string,
    name: string,
    session: any
}

export interface WhatsappClient {

    getDevice(): WhatsappDevice;
    getDeviceId(): string;
    getQrText(): string | null;

}