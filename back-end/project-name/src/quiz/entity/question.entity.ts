import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./quiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    question: string;

    @Column("simple-json")
    answers: string[];

    @Column()
    correct: string;

    @Column({ nullable: true })
    description_answer: string;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: "CASCADE" })
    quiz: Quiz;
}