/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:App/WebsocketService' {

  export interface WebsocketService {

    boot(): Promise<void>;

    getIo(): any;

  }

  const instance: WebsocketService;
  export default instance

}
