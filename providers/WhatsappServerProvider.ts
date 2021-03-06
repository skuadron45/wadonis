import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import * as WhatsappServerService from 'App/Whatsappserver/WhatsappServerService';
import * as ClientStore from 'App/Whatsappserver/ClientStore';

import BaseWhatsappServerService from 'App/WhatsappServer/impl/BaseWhatsappServerService';
import InMemoryClientStore from 'App/WhatsappServer/impl/InMemoryClientStore';

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
export default class WhatsappServerProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {
    this.app.container.singleton(WhatsappServerService.BIND_KEY, () => {
      return new BaseWhatsappServerService();
    });
    this.app.container.singleton(ClientStore.BIND_KEY, () => {
      return new InMemoryClientStore();
    });
  }

  public async boot() {

  }

  public async ready() {
    if (this.app.environment === 'web') {
      let whatsappServerService = <BaseWhatsappServerService>this.app.container.resolveBinding("App/WhatsappServer/WhatsappServerService");
      whatsappServerService.boot();
    }
  }

  public async shutdown() {

  }
}
