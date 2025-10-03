import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000', credentials: true } })
export class RoomGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(`room-${roomId}`);
  }

  @SubscribeMessage('startQuiz')
  handleStartQuiz(@MessageBody() roomId: string) {
    this.server.to(`room-${roomId}`).emit('startQuiz', roomId);
  }
}