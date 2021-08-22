export type RequestQrResponse = {
    success: boolean,
    device?: any,
    qrText?: string
};

export interface WebsocketService {
    boot(): Promise<void>;
    getIo(): any;
}