/**
 * Contract source: https://git.io/Jfefs
 *
 * Feel free to let us know via PR, if you find something broken in this contract
 * file.
 */

declare module '@ioc:App/WhatsappServer' {

  export interface WhatsappServer {

    boot(): Promise<void>;
    test(): Promise<void>;

  }
  const instance: WhatsappServer;
  export default instance
}
