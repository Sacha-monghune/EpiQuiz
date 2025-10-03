import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } });
    }

    async create(data: { email: string, username: string, password?: string }): Promise<User> {
        const user = this.userRepository.create(data);
        return this.userRepository.save(user);
    }

    async findOneById(id: number): Promise<User | null> {
        return this.userRepository.findOne({ where: { id } });
    }
}