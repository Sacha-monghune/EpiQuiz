import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { User } from '../user/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { Quiz } from 'src/quiz/entity/quiz.entity';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, Quiz]), JwtModule, UserModule],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway]
})
export class RoomModule {}