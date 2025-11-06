import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ResponseUser } from './entity/response.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ResponseUser)
        private readonly responseRepo: Repository<ResponseUser>,
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

    async saveUserResponse(userId: number, responses: string[]) {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) throw new Error('User non trouvé');

        const response = new ResponseUser();
        response.user = user;
        response.responses = responses;
        return await this.responseRepo.save(response);
    }
}