import { WhatsappClient } from 'App/WhatsappServer/WhatsappClient';

export const BIND_KEY = "App/WhatsappServer/ClientStore";

export interface ClientStore {

    get(deviceId: any): WhatsappClient | null;
    
    add(id: string, client: WhatsappClient): void;
    
}