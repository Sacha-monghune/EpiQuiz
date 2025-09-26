import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(data: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(data);
        return await this.usersRepository.save(user);
    }

    async findOneBySub(sub: string): Promise<User | null> {
        return this.usersRepository.findOneBy({ sub });
    }
}
