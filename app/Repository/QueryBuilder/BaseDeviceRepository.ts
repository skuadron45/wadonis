import Application from '@ioc:Adonis/Core/Application';
import { DeviceRepository } from 'App/Repository/DeviceRepository';
import { Device } from 'App/Repository/Device';

class BaseDeviceRepository implements DeviceRepository {


    public async findAll(): Promise<Device[]> {

        let Database = Application.container.resolveBinding("Adonis/Lucid/Database");
        let rows = await Database.query()
            .from('devices')
            .select('*');

        let devices = rows.map((row) => {
            let device: Device = {
                id: row.id,
                name: row.name,
                token: row.token,
                status: row.status,
                data: row
            }
            return device;
        });
        return devices;
    }

    public async findById(id: any): Promise<Device> {

        let Database = Application.container.resolveBinding("Adonis/Lucid/Database");
        let row = await Database.query()
            .from('devices')
            .select('*').where({ id: id }).first();

        let device: Device = {
            id: row.id,
            name: row.name,
            token: row.token,
            status: row.status,
            data: row
        }
        return device;
    }

}
export default BaseDeviceRepository;