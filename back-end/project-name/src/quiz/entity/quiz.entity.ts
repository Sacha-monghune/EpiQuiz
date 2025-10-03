import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Question, (question) => question.quiz, {
        cascade: true,
    })
    questions: Question[];

    @CreateDateColumn()
    created_at: Date;
}
