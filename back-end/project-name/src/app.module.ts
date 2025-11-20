import { Module } from '@nestjs/common';
import { QuizModule } from './quiz/quiz.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz/entity/quiz.entity';
import { MyConfigModule } from './config.module';
import { Question } from './quiz/entity/question.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entity/user.entity';
import { RoomModule } from './room/room.module';
import { Room } from './room/room.entity';
import { ResponseUser } from './user/entity/response.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      synchronize: true,
      entities: [Quiz, Question, User, Room, ResponseUser],
      extra: {
        ssl: { rejectUnauthorized: false },
      },
    }),
    TypeOrmModule.forFeature([Quiz, Question, User, Room, ResponseUser]),
    MyConfigModule,
    UserModule,
    QuizModule,
    AuthModule,
    RoomModule
  ],
})
export class AppModule {}
