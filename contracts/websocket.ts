/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:App/WebsocketService' {

  export type RequestQrResponse = {
    device: any,
    qrText: string
  };

  export interface WebsocketService {

    boot(): Promise<void>;

    getIo(): any;

  }

  const instance: WebsocketService;
  export default instance

}
