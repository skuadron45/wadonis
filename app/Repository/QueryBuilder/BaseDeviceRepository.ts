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
                data: row
            }
            return device;
        });
        return devices;
    }

}
export default BaseDeviceRepository;