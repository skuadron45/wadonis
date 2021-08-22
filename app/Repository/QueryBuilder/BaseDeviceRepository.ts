import Application from '@ioc:Adonis/Core/Application';
import { DeviceRepository } from 'App/Repository/DeviceRepository';
import { Device } from 'App/Repository/Device';

class BaseDeviceRepository implements DeviceRepository {

    public async updateSession(id: any, session: string): Promise<void> {
        let Database = Application.container.resolveBinding("Adonis/Lucid/Database");
        await Database.query()
            .from('devices')
            .where({ id: id }).update(
                'session', session ? JSON.stringify(session, null) : null
            )
    }

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
                session: row.session,
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
            session: row.session,
            data: row
        }
        return device;
    }

}
export default BaseDeviceRepository;