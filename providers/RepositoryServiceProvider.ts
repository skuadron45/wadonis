import * as DeviceRepository from 'App/Repository/DeviceRepository';
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import BaseDeviceRepository from 'App/Repository/QueryBuilder/BaseDeviceRepository'

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
export default class RepositoryServiceProvider {
  constructor(protected app: ApplicationContract) {
  }

  public register() {

    this.app.container.bind(DeviceRepository.BIND_KEY, () => {
      return new BaseDeviceRepository();
    })
  }

  public async boot() {

  }

  public async ready() {

  }

  public async shutdown() {

  }
}
