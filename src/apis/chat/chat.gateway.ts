import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

// 웹에서 데이터를 주고 받을 땐 HTTP를 사용함
// 하지만 HTTP는 요청이 있어야만 응답을 보내주기 때문에 실시간이 안된다
// 그래서 웹소켓이 필요하고 웹소켓 때문에 서버와 네트워크가 실시간으로 데이터를 주고 받을 수 있다.

@WebSocketGateway({ namespace: 'chat' }) // namespace는 프론트에서 http://localhost:3000/chat 에서 'chat'에 해당하는 부분
export class ChatGateway {
  @WebSocketServer() // 이거는 socket.io의 io 역할
  server: Server;

  wsClients = [];

  @SubscribeMessage('hihi')
  connectSomeone(@MessageBody() data: string, @ConnectedSocket() client) {
    const [name, room] = data;
    console.log(`${name}님이 코드: ${room}방에 입장했습니다.`);
    const comeOn = `${name}님이 입장했습니다.`;
    this.server.emit('comeOn' + room, comeOn);
    this.wsClients.push(client);
  }

  broadcast(event, client, message: any) {
    for (const c of this.wsClients) {
      if (client.id == c.id) {
        continue;
      }
      c.emit(event, message);
    }
  }

  @SubscribeMessage('send')
  sendMessage(@MessageBody() data: string, @ConnectedSocket() client) {
    const [room, name, message] = data;
    console.log(`${client.id} : ${data}`);
    this.broadcast(room, client, [name, message]);
  }
}
