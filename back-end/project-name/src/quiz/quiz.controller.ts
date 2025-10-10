import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { Quiz } from './entity/quiz.entity';
import { Question } from './entity/question.entity';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {}

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
}
