import Application from '@ioc:Adonis/Core/Application';
import { DeviceRepository } from 'App/Repository/DeviceRepository';
import { Device } from 'App/Repository/Device';

class BaseDeviceRepository implements DeviceRepository {


    public async updateStatus(id: any, status: number): Promise<void> {
        let database = Application.container.resolveBinding("Adonis/Lucid/Database");

        await database.query()
            .from('devices')
            .where({ id: id }).update(
                'status', status
            )
    }

    public async updateSession(id: any, session: any): Promise<void> {
        let database = Application.container.resolveBinding("Adonis/Lucid/Database");

        let sessionString = session ? JSON.stringify(session, null) : null
        await database.query()
            .from('devices')
            .where({ id: id }).update(
                'session', sessionString
            )
    }

    public async findAll(): Promise<Device[]> {

        let database = Application.container.resolveBinding("Adonis/Lucid/Database");
        let rows = await database.query()
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
        let database = Application.container.resolveBinding("Adonis/Lucid/Database");
        let row = await database.query()
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