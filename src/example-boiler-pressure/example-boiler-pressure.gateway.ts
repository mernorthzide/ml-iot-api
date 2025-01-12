import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExampleBoilerPressure } from './entities/example-boiler-pressure.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExampleBoilerPressureGateway {
  @WebSocketServer()
  server: Server;

  sendBoilerPressureUpdate(data: ExampleBoilerPressure) {
    this.server.emit('boilerPressureUpdate', data);
  }
}
