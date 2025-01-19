import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SchneiderPm2200Data } from './entities/schneider-pm2200-data.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SchneiderPm2200DataGateway {
  @WebSocketServer()
  server: Server;

  sendSchneiderPM2200Update(data: SchneiderPm2200Data) {
    this.server.emit('schneiderPM2200Update', data);
  }
}
