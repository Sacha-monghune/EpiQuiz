import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { ResponseUser } from './response.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({ default: 0})
    score: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ResponseUser, response => response.user)
    responses: ResponseUser[];
}

