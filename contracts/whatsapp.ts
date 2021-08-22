/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */


declare module '@ioc:App/WhatsappServer' {

  import WhatsappClient from "App/Services/WhatsappClient";

  export interface WhatsappServer {

    boot(): Promise<void>;

    getClient(deviceId: any): WhatsappClient;

  }
  const instance: WhatsappServer;
  export default instance
}
