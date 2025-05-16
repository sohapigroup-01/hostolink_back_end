// // src/controllers/conversation.controller.ts
// import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// import { ConversationService } from './conversations.service';
// import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';


// @Controller('conversations')
// export class ConversationController {
//   constructor(private readonly conversationService: ConversationService) {}

//   @Get()
//   @UseGuards(JwtAuthGuard)
//   async findAll(
//     @Query('userId') userId?: string,
//     @Query('assistantId') assistantId?: number,
//     @Query('etablissementId') etablissementId?: number,
//   ) {
//     if (userId) {
//       return this.conversationService.findByUser(userId);
//     } else if (assistantId) {
//       return this.conversationService.findByAssistant(assistantId);
//     } else if (etablissementId) {
//       return this.conversationService.findByEtablissementSante(etablissementId);
//     } else {
//       return this.conversationService.findAll();
//     }
//   }

//   @Get('active')
//   @UseGuards(JwtAuthGuard)
//   async getActiveConversations() {
//     return this.conversationService.getActiveConversations();
//   }

//   @Get(':id')
//   @UseGuards(JwtAuthGuard)
//   async findOne(@Param('id') id: string) {
//     return this.conversationService.findOne(+id);
//   }

//   @Get('count/assistant/:assistantId')
//   @UseGuards(JwtAuthGuard)
//   async countByAssistant(@Param('assistantId') assistantId: string) {
//     const count = await this.conversationService.countByAssistant(+assistantId);
//     return { count };
//   }

//   @Post()
//   @UseGuards(JwtAuthGuard)
//   async create(@Body() createConversationDto: CreateConversationDto) {
//     return this.conversationService.create(createConversationDto);
//   }

//   @Patch(':id')
//   @UseGuards(JwtAuthGuard)
//   async update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
//     return this.conversationService.update(+id, updateConversationDto);
//   }

//   @Patch(':id/archive')
//   @UseGuards(JwtAuthGuard)
//   async archive(@Param('id') id: string) {
//     return this.conversationService.archive(+id);
//   }
// }



// src/Discussion_agent_client/conversations/conversations.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConversationService } from './conversations.service';
import { CreateConversationDto, UpdateConversationDto } from './dto/conversation.dto';

@Controller('conversations')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(
    @Query('userId') userId?: string,
    @Query('assistantId') assistantId?: number,
    @Query('etablissementId') etablissementId?: number,
  ) {
    if (userId) {
      return this.conversationService.findByUser(userId);
    } else if (assistantId) {
      return this.conversationService.findByAssistant(assistantId);
    } else if (etablissementId) {
      return this.conversationService.findByEtablissementSante(etablissementId);
    } else {
      return this.conversationService.findAll();
    }
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  async getActiveConversations() {
    return this.conversationService.getActiveConversations();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.conversationService.findOne(+id);
  }

  @Get('active/user/:userId')
  @UseGuards(JwtAuthGuard)
  async getActiveConversationForUser(@Param('userId') userId: string) {
    const conversation = await this.conversationService.getActiveConversationForUser(userId);
    if (conversation) {
      return conversation;
    }
    // Créer automatiquement une nouvelle conversation si aucune n'existe
    return this.conversationService.getOrCreateConversation(userId);
  }

  @Get('active/etablissement/:etablissementId')
  @UseGuards(JwtAuthGuard)
  async getActiveConversationForEtablissement(@Param('etablissementId') etablissementId: string) {
    const conversation = await this.conversationService.getActiveConversationForEtablissement(+etablissementId);
    if (conversation) {
      return conversation;
    }
    // Créer automatiquement une nouvelle conversation si aucune n'existe
    return this.conversationService.getOrCreateConversation(undefined, +etablissementId);
  }

  @Get('count/assistant/:assistantId')
  @UseGuards(JwtAuthGuard)
  async countByAssistant(@Param('assistantId') assistantId: string) {
    const count = await this.conversationService.countByAssistant(+assistantId);
    return { count };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createConversationDto: CreateConversationDto) {
    // Création manuelle de conversation - utile pour les administrateurs
    return this.conversationService.create({
      ...createConversationDto,
      // autoCreated: false // Indiquer que c'est une création manuelle
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateConversationDto: UpdateConversationDto) {
    return this.conversationService.update(+id, updateConversationDto);
  }

  @Patch(':id/archive')
  @UseGuards(JwtAuthGuard)
  async archive(@Param('id') id: string) {
    return this.conversationService.archive(+id);
  }
}