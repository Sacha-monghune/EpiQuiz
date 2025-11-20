import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./question.entity";
import { ResponseUser } from "src/user/entity/response.entity"

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Question, question => question.quiz, { cascade: true })
    questions: Question[];

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ResponseUser, responseUser => responseUser.quiz)
    responses: ResponseUser[];
}

