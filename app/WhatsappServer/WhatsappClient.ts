export type Device = {
    id: string,
    name: string
}

export interface WhatsappClient {
    
    getDeviceId(): string;
    getDevice(): Device;
    getQrText(): string;
    
}