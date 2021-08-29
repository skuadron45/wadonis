import { ClientStore } from "../ClientStore";
import { WhatsappClient } from "../WhatsappClient";

export default class InMemoryClientStore implements ClientStore {

    protected clients = new Map<string, WhatsappClient>();

    public add(id: string, client: WhatsappClient): void {
        this.clients.set(id, client);
    }

    public get(deviceId: string): WhatsappClient | null {
        let client = this.clients.get(deviceId);
        if (client) {
            return client;
        }
        return null;
    }


}