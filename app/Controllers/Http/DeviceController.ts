import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';

export default class DeviceController {

    public async index({ view }: HttpContextContract) {

        let devices = await Database.query()
            .from('devices')
            .select('*');

        let data: any = {};

        data.devices = devices.map((device, index) => {
            device.index = index + 1;
            return device
        });
        return view.render("device/index", data);
    }

    public async create({ view }: HttpContextContract) {
        let data: any = {};
        return view.render("device/create", data);
    }

    public async qrcode({ view, params }: HttpContextContract) {        

        let id = params.id
        let device = await Database.query()
            .from('devices')
            .select('*').where({ id: id }).first();

        let data: any = {
            device: device
        };
        return view.render("device/qrcode", data);
    }
}
