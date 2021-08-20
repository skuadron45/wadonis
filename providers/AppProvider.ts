import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {

  protected app: ApplicationContract;

  constructor(app: ApplicationContract) {
    this.app = app;
  }

  public register() {
    // Register your own bindings
  }

  public async boot() {
  }

  public async ready() {
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
