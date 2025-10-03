import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sub: string;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: 0})
    score: number;

    @CreateDateColumn()
    createdAt: Date;
}
