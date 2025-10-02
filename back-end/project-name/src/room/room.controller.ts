import { Controller, Post, Body, Get, Param, Patch, Req, UnauthorizedException } from '@nestjs/common';
import { RoomService } from './room.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Quiz } from 'src/quiz/entity/quiz.entity';

@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    @Post()
    async create(@Body() data: { name: string, quiz: Quiz }, @Req() req): Promise<any> {
        const accessToken = req.cookies?.accessToken;
        if (!accessToken) throw new UnauthorizedException("Utilisateur non connecté");
    
        const token = this.jwtService.verify(accessToken);
        const user = await this.userService.findOneById(token.id);
        return this.roomService.create(data.name, user, data.quiz);
    }

    @Get()
    findAll(): Promise<any[]> {
        return this.roomService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<any> {
        return this.roomService.findOne(Number(id));
    }

    @Patch(':id/join')
    join(@Param('id') id: string, @Req() req) {
        const token = req.cookies?.accessToken;
        if (!token) throw new UnauthorizedException("Utilisateur non connecté");
    
        const user = this.jwtService.verify(token);
        console.log(user);
        return this.roomService.join(Number(id), user.id);
    }
}