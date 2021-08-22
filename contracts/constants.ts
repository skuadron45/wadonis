export type Device = {
    id: string,
    name: string
}

export interface WhatsappClient {

    getQrText(): string;

    getDevice(): Device;

}