import AdonisServer from '@ioc:Adonis/Core/Server';
import WebsocketService from '@ioc:App/WebsocketService';

WebsocketService.boot(AdonisServer.instance!);