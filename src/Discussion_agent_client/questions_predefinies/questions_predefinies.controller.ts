// src/controllers/question.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { QuestionService } from './questions_predefinies.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { Agent } from 'http';
import { JwtAgentAuthGuard } from 'src/auth/jwt-agent.guard';


@Controller('questions')
@UseGuards(JwtAgentAuthGuard)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @UseGuards(JwtAgentAuthGuard)
  async findAll(
    @Query('assistantId') assistantId?: number,
    @Query('category') category?: string,
    @Query('Agent') Agent?: boolean,
  ) {
    if (Agent) {
      return this.questionService.findAllAgent();
    } else if (assistantId && category) {
      return this.questionService.findByAssistantAndCategory(assistantId, category);
    } else if (assistantId) {
      return this.questionService.findByAssistant(assistantId);
    } else if (category) {
      return this.questionService.findByCategory(category);
    } else {
      return this.questionService.findAll();
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAgentAuthGuard)
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAgentAuthGuard)
  async update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAgentAuthGuard)
  async remove(@Param('id') id: string) {
    await this.questionService.remove(+id);
    return { message: 'Question supprimée avec succès' };
  }

  @Patch(':id/toggle-active')
  @UseGuards(JwtAgentAuthGuard)
  async toggleActive(@Param('id') id: string) {
    return this.questionService.toggleActive(+id);
  }
}