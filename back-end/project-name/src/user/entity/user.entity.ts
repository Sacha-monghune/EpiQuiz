import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string

    @Column({ default: 0})
    score: number;

    @CreateDateColumn()
    createdAt: Date;
}
