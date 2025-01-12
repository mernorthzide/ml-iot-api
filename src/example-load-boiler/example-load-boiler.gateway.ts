import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExampleLoadBoiler } from './entities/example-load-boiler.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExampleLoadBoilerGateway {
  @WebSocketServer()
  server: Server;

  sendLoadBoilerUpdate(data: ExampleLoadBoiler) {
    this.server.emit('loadBoilerUpdate', data);
  }
}
