// // src/services/conversation.service.ts
// import { Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Conversation } from './entities/conversation.entity';
// import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
// import { QuestionService } from '../questions_predefinies/questions_predefinies.service';
// import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';


// @Injectable()
// export class ConversationService {
//   constructor(
//     @InjectRepository(Conversation)
//     private conversationRepository: Repository<Conversation>,
//     @InjectRepository(MessageAssistantClient)
//     private messageRepository: Repository<MessageAssistantClient>,
//     private questionService: QuestionService,
//   ) {}

//   async findAll(): Promise<Conversation[]> {
//     return this.conversationRepository.find();
//   }

//   async findByUser(userId: string): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { userId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findByEtablissementSante(etablissementSanteId: number): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { etablissementSanteId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findByAssistant(assistantId: number): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { assistantId },
//       order: { startTime: 'DESC' },
//     });
//   }

//   async findOne(id: number): Promise<Conversation> {
//     const conversation = await this.conversationRepository.findOne({
//       where: { id },
//       relations: ['messages', 'messages.images', 'messages.questionSugerer'],
//     });
    
//     if (!conversation) {
//       throw new NotFoundException(`Conversation avec l'ID ${id} non trouvée`);
//     }
    
//     return conversation;
//   }

//   async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
//     const conversation = this.conversationRepository.create({
//       userId: createConversationDto.userId,
//       etablissementSanteId: createConversationDto.etablissementSanteId,
//       assistantId: createConversationDto.assistantId,
//       status: 'active',
//     });
    
//     const savedConversation = await this.conversationRepository.save(conversation);
    
//     // Si une question initiale est fournie, créer le premier message
//     if (createConversationDto.initialQuestionId) {
//       const question = await this.questionService.findOne(createConversationDto.initialQuestionId);
      
//       const message = this.messageRepository.create({
//         conversationId: savedConversation.id,
//         envoyerPar: 'user',
//         messageText: question.questionText,
//         questionPredefinie: true,
//         questionSugererId: question.id,
//         hasFile: false,
//       });
      
//       await this.messageRepository.save(message);
//     }
    
//     return this.findOne(savedConversation.id);
//   }

//   async update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
//     const conversation = await this.findOne(id);
//     const updated = Object.assign(conversation, updateConversationDto);
//     await this.conversationRepository.save(updated);
//     return this.findOne(id);
//   }

//   async archive(id: number): Promise<Conversation> {
//     const conversation = await this.findOne(id);
//     conversation.status = 'archived';
//     await this.conversationRepository.save(conversation);
//     return this.findOne(id);
//   }

//   async countByAssistant(assistantId: number): Promise<number> {
//     return this.conversationRepository.count({
//       where: { assistantId },
//     });
//   }

//   async getActiveConversations(): Promise<Conversation[]> {
//     return this.conversationRepository.find({
//       where: { status: 'active' },
//       order: { startTime: 'DESC' },
//     });
//   }
// }


 
// src/services/conversation.service.ts
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { MessageAssistantClient } from '../message_assistant_client/entities/message-assistant-client.entity';
import { QuestionService } from '../questions_predefinies/questions_predefinies.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';
import { AgentAssistanceService } from 'src/agent-assistant/agent-assistant.service';
import { MessageService } from '../message_assistant_client/message_assistant_client.service';


@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(MessageAssistantClient)
    private messageRepository: Repository<MessageAssistantClient>,
    private questionService: QuestionService,
    private agentService: AgentAssistanceService,
    @Inject(forwardRef(() => MessageService))
    private messageService: MessageService,
  ) {}

  async findAll(): Promise<Conversation[]> {
    return this.conversationRepository.find();
  }

  async findByUser(userId: string): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { userId },
      order: { startTime: 'DESC' },
    });
  }

  async findByEtablissementSante(etablissementSanteId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { etablissementSanteId },
      order: { startTime: 'DESC' },
    });
  }

  async findByAssistant(assistantId: number): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { assistantId },
      order: { startTime: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Conversation> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['messages', 'messages.images', 'messages.questionSugerer'],
    });
    
    if (!conversation) {
      throw new NotFoundException(`Conversation avec l'ID ${id} non trouvée`);
    }
    
    return conversation;
  }

  async getActiveConversationForUser(userId: string): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: { userId, status: 'active' },
      order: { startTime: 'DESC' },
    });
  }

  async getActiveConversationForEtablissement(etablissementSanteId: number): Promise<Conversation | null> {
    return this.conversationRepository.findOne({
      where: { etablissementSanteId, status: 'active' },
      order: { startTime: 'DESC' },
    });
  }






  async getOrCreateConversation(
    userId?: string, 
    etablissementSanteId?: number, 
    assistantId?: number,
    initialQuestionId?: number
  ): Promise<Conversation> {
    // Vérifier si une conversation active existe déjà
    let conversation: Conversation | null = null;
    
    if (userId) {
      conversation = await this.getActiveConversationForUser(userId);
    } else if (etablissementSanteId) {
      conversation = await this.getActiveConversationForEtablissement(etablissementSanteId);
    }
    
    // Si conversation existe, la retourner
    if (conversation) {
      return conversation;
    }
  
    // Pour éviter les problèmes de clé étrangère, vérifier les paramètres
    if (etablissementSanteId) {
      try {
        // Utilisons une requête native pour vérifier si l'établissement existe
        const query = `SELECT COUNT(*) FROM user_etablissement_sante WHERE id_etablissement_sante = $1`;
        const result = await this.conversationRepository.query(query, [etablissementSanteId]);
        
        if (result[0].count === '0') {
          throw new Error(`Établissement avec l'ID ${etablissementSanteId} non trouvé`);
        }
      } catch (error) {
        // Si l'établissement n'existe pas, utilisez l'userId à la place
        etablissementSanteId = undefined;
      }
    }
  
    // Sinon, en créer une nouvelle
    if (!assistantId) {
      const activeAgents = await this.agentService.findActive();
      if (activeAgents.length === 0) {
        throw new Error('Aucun agent d\'assistance disponible');
      }
      assistantId = activeAgents[0].id;
    }
  
    const createDto: CreateConversationDto = {
      userId,
      etablissementSanteId,
      assistantId,
      initialQuestionId
    };
  
    return this.create(createDto);
  }





  async create(createConversationDto: CreateConversationDto): Promise<Conversation> {
    const conversation = this.conversationRepository.create({
      userId: createConversationDto.userId,
      etablissementSanteId: createConversationDto.etablissementSanteId,
      assistantId: createConversationDto.assistantId,
      status: 'active',
      // autoCreated: createConversationDto.autoCreated ?? true,
    });
    
    const savedConversation = await this.conversationRepository.save(conversation);
    
    // Si une question initiale est fournie, créer le premier message
    if (createConversationDto.initialQuestionId) {
      const question = await this.questionService.findOne(createConversationDto.initialQuestionId);
      
      const message = this.messageRepository.create({
        conversation: savedConversation,
        conversationId: savedConversation.id,
        envoyerPar: 'user',
        messageText: question.questionText,
        questionSugerer: question,
        questionSugererId: question.id,
        hasFile: false,
      });
      await this.messageRepository.save(message);
    }
    
    return this.findOne(savedConversation.id);
  }

  async update(id: number, updateConversationDto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findOne(id);
    const updated = Object.assign(conversation, updateConversationDto);
    await this.conversationRepository.save(updated);
    return this.findOne(id);
  }

  async archive(id: number): Promise<Conversation> {
    const conversation = await this.findOne(id);
    conversation.status = 'archived';
    await this.conversationRepository.save(conversation);
    return this.findOne(id);
  }

  async countByAssistant(assistantId: number): Promise<number> {
    return this.conversationRepository.count({
      where: { assistantId },
    });
  }

  async getActiveConversations(): Promise<Conversation[]> {
    return this.conversationRepository.find({
      where: { status: 'active' },
      order: { startTime: 'DESC' },
    });
  }
}