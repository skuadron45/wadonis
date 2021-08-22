import { Device } from './Device';
export const BIND_KEY = "App/Repository/DeviceRepository";

export interface DeviceRepository {

    findAll(): Promise<Device[]>

    findById(id: any): Promise<Device>

    updateSession(id: any, session: any): Promise<void>

}