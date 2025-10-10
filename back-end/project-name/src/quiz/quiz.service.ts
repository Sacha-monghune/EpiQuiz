import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './entity/quiz.entity';
import { Repository } from 'typeorm';
import { Question } from './entity/question.entity';

@Injectable()
export class QuizService {
    constructor(
        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>
    ) {}

/* CRUD */
    // findAll(): Promise<Quiz[]> {
    //     return this.quizRepository.find({
    //         relations: ["questions"],
    //     });
    // }

    async findAll(search?: string): Promise<Quiz[]> {
        const qb = this.quizRepository.createQueryBuilder("quiz")
            .leftJoinAndSelect("quiz.questions", "question");

        if (search) {
            qb.where("LOWER(quiz.name) LIKE :search", { search: `%${search.toLowerCase()}%` });
        }

        return qb.getMany();
    }

    async findOne(id: number): Promise<Question[]> {
        const quiz = await this.quizRepository.findOne({
            where: { id },
            relations: ["questions"],
        });

        if (!quiz)
            throw new NotFoundException(`Quiz ${id} not found`);
        return quiz.questions;
    }


    async create(data: Partial<Quiz>): Promise<Quiz> {
        const quiz = this.quizRepository.create(data);

        return this.quizRepository.save(quiz);
    }

    async remove(id: number): Promise<void> {
        const result = await this.quizRepository.delete(id)

        if (result.affected === 0) {
            throw new NotFoundException(`Quiz ${id} not found`);
        }
    }

    async update(id: number, data: Partial<Quiz>): Promise<Quiz> {
        const quiz = await this.quizRepository.preload({
            id: id,
            ...data,
        });

        if (!quiz) {
            throw new NotFoundException(`Quiz ${id} not found`);
        }

        return this.quizRepository.save(quiz);
    }
/* CRUD */
}
