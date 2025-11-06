import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResponseUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array", { nullable: true })
    responses: string[];
    
    @ManyToOne(() => User, user => user.responses, { onDelete: 'CASCADE' })
    user: User;
}