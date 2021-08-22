export default interface WebSocketService {
    boot(): Promise<void>;
    getIo(): any;
}

export type RequestQrResponse = {
    success: boolean,
    device?: any,
    qrText?: string
};