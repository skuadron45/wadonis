import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import BaseWebsocketService from 'App/Services/BaseWebSocketService'
/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class WebSocketProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
    this.app.container.singleton('App/WebsocketService', () => new BaseWebsocketService())
  }

  public async boot() {

  }

  public async ready() {
    if (this.app.environment === 'web') {
      await import('../start/socket')
    }
  }

  public async shutdown() {

  }
}
