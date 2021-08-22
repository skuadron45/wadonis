export type RequestQrResponse = {
    success: boolean,
    device?: any,
    qrText?: string
};

export interface WebSocketService {
    boot(): Promise<void>;
    getIo(): any;
}