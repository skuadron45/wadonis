export const BIND_KEY = "App/Websocket/WebSocketService";

export interface WebSocketService {

    boot(): Promise<void>;
    emitTo(room: string, event: string, ...args: any[]): void;

}

export type RequestQrResponse = {
    success: boolean,
    device?: any,
    qrText?: string | null
};