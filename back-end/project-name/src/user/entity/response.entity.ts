import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Entity()
export class ResponseUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array", { nullable: true })
    responses: string[];

    @Column()
    score: number;

    @Column()
    total: number;

    @ManyToOne(() => User, user => user.responses, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Quiz, quiz => quiz.responses, { onDelete: 'CASCADE' })
    quiz: Quiz;

    @CreateDateColumn()
    createdAt: Date;
}
