import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

  public async login({ view, session }: HttpContextContract) {
    let error = session.flashMessages.get("error");
    let data: any = {};
    data.error = error;
    return view.render("auth/login", data);
  }

  public async loginAttempt({ auth, request, response, session }: HttpContextContract) {

    const email = request.input('email')
    const password = request.input('password')
    try {
      await auth.use('web').attempt(email, password);
      response.redirect().toRoute("dashboard.index")
    } catch (e) {
      session.flash('error', "Login gagal !");
      response.redirect().back();
    }
  }

  public async logout({ auth, response, session }: HttpContextContract) {
    await auth.use('web').logout();
    response.redirect().toRoute("dashboard.index")
  }
}
