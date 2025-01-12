import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // ในการใช้งานจริงควรระบุ origin ที่แน่นอน
  },
})
export class ExampleGasStationGateway {
  @WebSocketServer()
  server: Server;

  sendUpdate(data: any) {
    this.server.emit('gasStationUpdate', data);
  }
}
