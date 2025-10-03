import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
      TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  exports: [UserService, TypeOrmModule],
  providers: [UserService]
})
export class UserModule {}
