export type Device = {
    id: string,
    name: string
}

export default interface WhatsappClient {

    getDeviceId(): string;
    getDevice(): Device;
    getQrText(): string;

}