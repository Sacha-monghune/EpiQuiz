import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Req
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './entity/quiz.entity';
import { Question } from './entity/question.entity';
import { UserService } from 'src/user/user.service';
import type { AuthenticatedRequest } from 'src/AuthenticateRequest';

@Controller('quiz')
export class QuizController {
    constructor(
        private readonly quizService: QuizService,
        private readonly userService: UserService,
    ) {}

    @Post()
    create(@Body() data: Partial<Quiz>): Promise<Quiz> {
        return this.quizService.create(data);
    }

    @Get()
    findAll(@Query('search') search?: string): Promise<Quiz[]> {
        return this.quizService.findAll(search);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number): Promise<Question[]> {
        return this.quizService.findOne(id);
    }

    @Delete(":id")
    deleteOne(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.quizService.remove(id);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Quiz>): Promise<Quiz> {
        return this.quizService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.quizService.remove(id);
    }

    // route qui permet de sauvegarder nos quuiz pour le user comme ça Luan peut être content
    @Post(':id/response')
    async saveResponse(
        @Param('id', ParseIntPipe) quizId: number,
        @Body() body: { responses: string[]; score: number; total: number },
        @Req() req: AuthenticatedRequest,
    ) {
        const userId = req.cookies?.userId;

        if (!userId) {
            throw new Error('Utilisateur non authentifié');
        }

        return this.userService.saveUserResponse({
            userId: +userId, quizId,
            responses: body.responses,
            score: body.score,
            total: body.total,
        });
    }
}
