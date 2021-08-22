export const BIND_KEY = "App/Websocket/WebSocketService";

export interface WebSocketService {
    boot(): Promise<void>;
    getIo(): any;
}

export type RequestQrResponse = {
    success: boolean,
    device?: any,
    qrText?: string
};