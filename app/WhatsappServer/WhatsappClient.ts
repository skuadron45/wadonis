export type WhatsappDevice = {
    id: string,
    name: string,
    session: any
}

export interface WhatsappClient {

    connect(): Promise<void>;    

    getDevice(): WhatsappDevice;

    getQrText(): string | null;

    sendMessage(phone: string, message: string): Promise<void>;

    getContacts(): Promise<any>

}