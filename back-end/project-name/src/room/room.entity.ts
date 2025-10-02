import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, OneToOne, ManyToOne } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: false })
    started: boolean;

    @ManyToMany(() => User)
    @JoinTable()
    users: User[];

    @ManyToOne(() => Quiz)
    quiz: Quiz;
}