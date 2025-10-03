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

  // Quand un user rejoint une room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() roomId: string, @ConnectedSocket() client: Socket) {
    client.join(`room-${roomId}`);
  }

  // Quand le host lance le quiz
  @SubscribeMessage('startQuiz')
  handleStartQuiz(@MessageBody() roomId: string) {
    // Envoie à tous les users de la room l'event "startQuiz"
    this.server.to(`room-${roomId}`).emit('startQuiz', roomId);
  }
}