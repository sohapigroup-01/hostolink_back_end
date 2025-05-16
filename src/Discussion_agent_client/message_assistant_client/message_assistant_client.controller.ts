

// src/controllers/message.controller.ts
import { Controller, Get, Post, Body, Param, UseInterceptors, UploadedFile, UseGuards, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateImageDto } from '../messages_assistant_client_image/dto/image_message.dto';
import { MessageService } from './message_assistant_client.service';
import { CloudinaryService } from 'config/cloudinary.config';
import { CreateMessageDto, CreateMessageWithImageDto } from './dto/message.dto';
import { multerOptions } from 'config/multer.config';

@Controller('messages')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('conversation/:conversationId')
  @UseGuards(JwtAuthGuard)
  async findByConversation(@Param('conversationId') conversationId: string) {
    return this.messageService.findByConversation(+conversationId);
  }

  @Get('conversation/:conversationId/last')
  @UseGuards(JwtAuthGuard)
  async getLastMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: number,
  ) {
    return this.messageService.getLastMessagesByConversation(+conversationId, limit ? +limit : 10);
  }

  @Get('conversation/:conversationId/count')
  @UseGuards(JwtAuthGuard)
  async countByConversation(@Param('conversationId') conversationId: string) {
    const count = await this.messageService.countByConversation(+conversationId);
    return { count };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMessageDto: CreateMessageDto) {
    // Le service crée ou récupère automatiquement une conversation si nécessaire
    return this.messageService.create(createMessageDto);
  }

  @Post('with-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions)) // <- multerOptions requis))
  async createWithImage(
    @Body() createMessageDto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
    
  ) {

    // Upload de l'image sur Cloudinary (renvoie directement l'URL)
    const imageUrl = await this.cloudinaryService.uploadImage(file);
   
    // Création du message avec l'image
    const messageWithImageDto: CreateMessageWithImageDto = {
      ...createMessageDto,
      images: [
        {
          imageUrl: imageUrl, // Utiliser directement l'URL
          altText: file.originalname,
        },
      ],
    };
   
    // Le service crée ou récupère automatiquement une conversation si nécessaire
    return this.messageService.createWithImage(messageWithImageDto);
  }

  @Post(':id/add-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addImageToMessage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Upload de l'image sur Cloudinary (renvoie directement l'URL)
    const imageUrl = await this.cloudinaryService.uploadImage(file);
   
    const createImageDto: CreateImageDto = {
      messageId: +id,
      imageUrl: imageUrl, // Utiliser directement l'URL
      altText: file.originalname,
    };
   
    return this.messageService.addImageToMessage(+id, createImageDto);
  }
}