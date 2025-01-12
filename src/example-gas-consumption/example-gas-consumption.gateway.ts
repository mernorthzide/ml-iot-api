import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ExampleGasConsumption } from './entities/example-gas-consumption.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ExampleGasConsumptionGateway {
  @WebSocketServer()
  server: Server;

  sendGasConsumptionUpdate(data: ExampleGasConsumption) {
    this.server.emit('gasConsumptionUpdate', data);
  }
}
