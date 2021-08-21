// import WebsocketService from '@ioc:App/WebsocketService';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database';

export default class DashboardController {

    public async index({ view }: HttpContextContract) {

        let devices = await Database.query()
            .from('devices')
            .select('*');

        let data: any = {};

        data.devices = devices.map((device, index) => {
            device.index = index + 1;
            return device
        });
        return view.render("dashboard/index", data);
    }
}