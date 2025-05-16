import { Controller, Post, Body, ParseIntPipe, Param, Get, NotFoundException, Patch } from '@nestjs/common';

import { CreateThematiqueDto } from './dto/create-thematique.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ThematiqueDiscussionService } from './thematique_message.service';
import { RepondreMessageExpertDto } from './dto/reponse-message-expert.dto';


@Controller('thematiques') // <-- On change ici
export class ThematiqueDiscussionController {
  
  
 constructor(
  private readonly thematiqueService: ThematiqueDiscussionService,

 // ✅ injection ici
    ) {}

  @Post()
  async createThematique(@Body() dto: CreateThematiqueDto) {
    return this.thematiqueService.createThematique(dto);
  }

  @Post('/messages')
  async createMessage(@Body() dto: CreateMessageDto) {
    return this.thematiqueService.createMessage(dto);
  }

   // ✅ GET /thematiques/:id/messages
   @Get(':id/messages')
   async getMessagesByThematique(@Param('id', ParseIntPipe) id: number) {
     const messages = await this.thematiqueService.getMessagesByThematique(id);
     if (!messages || messages.length === 0) {
       throw new NotFoundException('Aucun message trouvé pour cette thématique.');
     }
     return messages;
  }



  @Post('/messages/repondre')
  async repondreEnTantQueExpert(@Body() dto: RepondreMessageExpertDto) {
  return this.thematiqueService.repondreEnTantQueExpert(dto);
  }


  @Patch(':id/mark-as-read')
  async markMessagesAsRead(
    @Param('id', ParseIntPipe) id: number,
    @Body('id_user') id_user: string,
  ) {
    await this.thematiqueService.marquerMessagesCommeLus(id, id_user);
    return { success: true, message: 'Messages marqués comme lus' };
  }
   



}
