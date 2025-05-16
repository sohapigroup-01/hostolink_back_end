// src/agent-assistance/agent-assistance.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request, UnauthorizedException, Patch } from '@nestjs/common';
import { AgentAssistanceService } from './agent-assistant.service';
import { JwtAgentAuthGuard } from 'src/auth/jwt-agent.guard';
import { CreateAgentDto } from './dto/agent.dto';
import { JwtAdminGuard } from 'src/auth/jwt-auth.guard';
import { LoginAgentDto } from './dto/login-agent.dto';


@Controller('agent-assistant')
export class AgentAssistanceController {
  constructor(private readonly agentService: AgentAssistanceService) {}

  @Post('login')
  async login(@Body() loginDto: LoginAgentDto) {
    const agent = await this.agentService.validateAgent(loginDto.email, loginDto.password);
    if (!agent) {
      throw new UnauthorizedException('Identifiants de connexion incorrects');
    }
    return this.agentService.login(agent);
  }

  @Get('profile')
  @UseGuards(JwtAgentAuthGuard)
  getProfile(@Request() req) {
    // req.user contiendra les informations de l'agent authentifié
    return req.user;
  }

  // Endpoint pour que l'admin puisse créer un agent
  @Post()
  @UseGuards(JwtAdminGuard) // Protection par le garde administrateur
  createAgent(@Body() createAgentDto: CreateAgentDto, @Request() req) {
    // On peut utiliser l'ID de l'admin connecté comme idAdminGestionnaire
    // si ce n'est pas déjà fourni dans le DTO
    if (!createAgentDto.idAdminGestionnaire && req.user && req.user.id) {
      createAgentDto.idAdminGestionnaire = req.user.id;
    }
    
    return this.agentService.createAgent(createAgentDto);
  }

  // Endpoint pour que l'admin puisse désactiver un agent
  @Patch(':id/deactivate')
  @UseGuards(JwtAdminGuard)
  deactivateAgent(@Param('id') id: string) {
    return this.agentService.deactivateAgent(+id);
  }

  // Endpoint pour que l'admin puisse réactiver un agent
  @Patch(':id/activate')
  @UseGuards(JwtAdminGuard)
  activateAgent(@Param('id') id: string) {
    return this.agentService.activateAgent(+id);
  }
  
  // Les endpoints ci-dessous sont accessibles aux agents authentifiés
  @Get()
  @UseGuards(JwtAgentAuthGuard)
  findAll() {
    return this.agentService.findAll();
  }
  
  // Cet endpoint est public pour permettre d'afficher les agents actifs
  @Get('active')
  @UseGuards(JwtAdminGuard)
  findActive() {
    return this.agentService.findActive();
  }

  @Get(':id')
  @UseGuards(JwtAgentAuthGuard)
  findOne(@Param('id') id: string) {
    return this.agentService.getAgentById(+id);
  }
}