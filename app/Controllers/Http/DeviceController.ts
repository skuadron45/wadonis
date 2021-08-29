import DeviceRepository from '@ioc:App/Repository/DeviceRepository';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

export default class DeviceController {

    public async index({ view }: HttpContextContract) {

        let devices = await DeviceRepository.findAll();

        let data: any = {};
        data.devices = devices.map((device, index) => {

            let data = device.data;

            let deviceCustom = device.data;
            deviceCustom.index = index + 1;
            deviceCustom.needQr = data.session ? false : true;

            deviceCustom.statusHTML = data.status === 1 ? "<span class='badge badge-success'>Connected</span>" : "<span class='badge badge-danger'>Disconnected</span>";
            deviceCustom.sessionHTML = data.session ? "<span class='badge badge-success'>Alredy Login</span>" : "<span class='badge badge-danger'>Not Login</span>";
            return deviceCustom
        });
        return view.render("device/index", data);
    }

    public async create({ view }: HttpContextContract) {
        let data: any = {};
        return view.render("device/create", data);
    }

    public async qrcode({ view, params, response }: HttpContextContract) {

        let id = params.id
        let device = await DeviceRepository.findById(id);

        if (device.session) {
            response.redirect().toRoute('device.index');
        }

        let data: any = {
            device: device.data
        };
        return view.render("device/qrcode", data);
    }

    public async fitur({ view, params, response }: HttpContextContract) {

        let id = params.id
        let device = await DeviceRepository.findById(id);

        if (!device.session) {
            response.redirect().toRoute('device.index');
        }

        let data: any = {
            device: device.data
        };
        return view.render("device/fitur", data);
    }
}
