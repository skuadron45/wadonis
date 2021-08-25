import { GuardsList } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class RedirectIfAuthenticated {

  /**
   * Handle request
   */
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>, customGuards: (keyof GuardsList)[]) {

    const guards = customGuards.length ? customGuards : [auth.name]
    for (let guard of guards) {
      if (await auth.use(guard).check()) {
        return response.redirect().toRoute("dashboard.index");
      }
    }
    await next()
  }
}

