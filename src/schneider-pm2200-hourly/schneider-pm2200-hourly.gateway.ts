import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SchneiderPm2200Hourly } from './entities/schneider-pm2200-hourly.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SchneiderPm2200HourlyGateway {
  @WebSocketServer()
  server: Server;

  sendSchneiderPM2200HourlyUpdate(data: SchneiderPm2200Hourly) {
    this.server.emit('schneiderPM2200HourlyUpdate', data);
  }
}
