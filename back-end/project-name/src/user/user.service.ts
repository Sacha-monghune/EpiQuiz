import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ResponseUser } from './entity/response.entity';
import { Repository } from 'typeorm';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(ResponseUser)
        private readonly responseRepo: Repository<ResponseUser>,

        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>,
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

    // 🔥 Nouvelle version : on accepte un objet complet
    async saveUserResponse(data: {
        userId: number;
        quizId: number;
        responses: string[];
        score: number;
        total: number;
    }) {
        const user = await this.userRepository.findOneBy({ id: data.userId });
        if (!user) throw new Error('User non trouvé');

        const quiz = await this.quizRepository.findOneBy({ id: data.quizId });
        if (!quiz) throw new Error('Quiz non trouvé');

        const response = new ResponseUser();
        response.user = user;
        response.quiz = quiz;
        response.responses = data.responses;
        response.score = data.score;
        response.total = data.total;

        return await this.responseRepo.save(response);
    }
}
