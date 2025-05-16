// src/services/question.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionsPredefinies } from './entities/question-predefinie.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionsPredefinies)
    private QuestionsPredefiniesRepository: Repository<QuestionsPredefinies>,
  ) {}

  async findAll(): Promise<QuestionsPredefinies[]> {
    return this.QuestionsPredefiniesRepository.find({ where: { isActive: true } });
  }

  async findAllAgent(): Promise<QuestionsPredefinies[]> {
    return this.QuestionsPredefiniesRepository.find();
  }

  async findByAssistant(assistantId: number): Promise<QuestionsPredefinies[]> {
    return this.QuestionsPredefiniesRepository.find({
      where: { assistantId, isActive: true },
    });
  }

  async findByCategory(category: string): Promise<QuestionsPredefinies[]> {
    return this.QuestionsPredefiniesRepository.find({
      where: { category, isActive: true },
    });
  }

  async findByAssistantAndCategory(assistantId: number, category: string): Promise<QuestionsPredefinies[]> {
    return this.QuestionsPredefiniesRepository.find({
      where: { assistantId, category, isActive: true },
    });
  }

  async findOne(id: number): Promise<QuestionsPredefinies> {
    const question = await this.QuestionsPredefiniesRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException(`Question avec l'ID ${id} non trouvée`);
    }
    return question;
  }

  async create(createQuestionDto: CreateQuestionDto): Promise<QuestionsPredefinies> {
    const question = this.QuestionsPredefiniesRepository.create(createQuestionDto);
    return this.QuestionsPredefiniesRepository.save(question);
  }

  async update(id: number, updateQuestionDto: UpdateQuestionDto): Promise<QuestionsPredefinies> {
    const question = await this.findOne(id);
    const updated = Object.assign(question, updateQuestionDto);
    return this.QuestionsPredefiniesRepository.save(updated);
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.QuestionsPredefiniesRepository.remove(question);
  }

  async toggleActive(id: number): Promise<QuestionsPredefinies> {
    const question = await this.findOne(id);
    question.isActive = !question.isActive;
    return this.QuestionsPredefiniesRepository.save(question);
  }
}