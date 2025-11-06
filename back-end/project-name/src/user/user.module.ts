import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseUser } from './entity/response.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([User, ResponseUser]),
  ],
  controllers: [],
  exports: [UserService, TypeOrmModule],
  providers: [UserService]
})
export class UserModule {}
