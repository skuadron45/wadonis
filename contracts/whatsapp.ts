/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */


declare module '@ioc:App/WhatsappServerService' {

  export type Device = {
    id: string,
    name: string
  }

  export interface WhatsappClient {

    getQrText(): string;

    getDevice(): Device;

  }

  export interface WhatsappServerService {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

  }
  const instance: WhatsappServerService;
  export default instance
}
