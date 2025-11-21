import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseUser } from './entity/response.entity';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, ResponseUser, Quiz]),
  ],
  controllers: [],
  exports: [UserService, TypeOrmModule],
  providers: [UserService]
})
export class UserModule {}
