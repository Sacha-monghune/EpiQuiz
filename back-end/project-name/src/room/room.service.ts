import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './room.entity';
import { Repository } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectRepository(Room)
        private readonly roomRepository: Repository<Room>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>,
    ) {}

    async create(name: string, user: User | null, quiz: Quiz): Promise<Room> {
    const room = this.roomRepository.create({ name, users: [], quiz: quiz });

    console.log("room:", room);
    
    return this.roomRepository.save(room);
}


    async findOne(id: number): Promise<Room | null> {
        return this.roomRepository.findOne({
            where: { id },
            relations: ['users', 'quiz'],
        });
    }

    async findAll(): Promise<Room[]> {
        return this.roomRepository.find({relations: ['users']});
    }

    async join(roomId: number, userId: number): Promise<Room | null> {
        const room = await this.roomRepository.findOne({
            where: { id: roomId },
            relations: ['users'],
        });
        console.log(room);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        console.log(user);
        if (room && user) {
            room.users.push(user);
            await this.roomRepository.save(room);
            return room;
        }
        return null;
    }
}