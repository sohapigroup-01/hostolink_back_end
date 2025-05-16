// src/agent-assistance/agent-assistance.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentAssistance } from './entities/agent-assistance.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateAgentDto } from './dto/agent.dto';


@Injectable()
export class AgentAssistanceService {
  constructor(
    @InjectRepository(AgentAssistance)
    private agentAssistanceRepository: Repository<AgentAssistance>,
    private jwtService: JwtService,
  ) {}

  async getAgentById(id: number): Promise<AgentAssistance> {
    const agent = await this.agentAssistanceRepository.findOne({ where: { id } });
    if (!agent) {
      throw new NotFoundException(`Agent d'assistance avec l'ID ${id} non trouvé`);
    }
    return agent;
  }

  async findByEmail(email: string): Promise<AgentAssistance | null> {
    return this.agentAssistanceRepository.findOne({ where: { email } });
  }

  async validateAgent(email: string, password: string): Promise<AgentAssistance | null> {
    const agent = await this.findByEmail(email);
    if (!agent) {
      return null;
    }

    // Vérifier que l'agent est actif
    if (agent.statut !== 'actif') {
      return null;
    }

    // Vérifier le mot de passe (utiliser bcrypt au lieu de crypto)
    const isPasswordValid = await bcrypt.compare(password, agent.mdp);
    if (!isPasswordValid) {
      return null;
    }

    return agent;
  }

  async login(agent: AgentAssistance) {
    const payload = { id: agent.id, email: agent.email, nom: agent.nom, prenom: agent.prenom };
   
    return {
      access_token: this.jwtService.sign(payload),
      agent: {
        id: agent.id,
        email: agent.email,
        nom: agent.nom,
        prenom: agent.prenom,
        urlPhotoAgent: agent.urlPhotoAgent,
      },
    };
  }

  async findAll(): Promise<AgentAssistance[]> {
    return this.agentAssistanceRepository.find();
  }

  async findActive(): Promise<AgentAssistance[]> {
    return this.agentAssistanceRepository.find({ where: { statut: 'actif' } });
  }

  // Méthode pour créer un nouvel agent (appelée par l'admin)
  async createAgent(createAgentDto: CreateAgentDto): Promise<AgentAssistance> {
    // Vérifier si l'email existe déjà
    const existingAgent = await this.findByEmail(createAgentDto.email);
    if (existingAgent) {
      throw new ConflictException(`Un agent avec l'email ${createAgentDto.email} existe déjà`);
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(createAgentDto.password, 10);

    // Créer le nouvel agent
    const newAgent = this.agentAssistanceRepository.create({
      nom: createAgentDto.nom,
      prenom: createAgentDto.prenom,
      email: createAgentDto.email,
      telephone: createAgentDto.telephone,
      mdp: hashedPassword,
      urlPhotoAgent: createAgentDto.urlPhotoAgent,
      idAdminGestionnaire: createAgentDto.idAdminGestionnaire,
      statut: 'actif',
      dateCreation: new Date(),
      dateModification: new Date(),
    });

    return this.agentAssistanceRepository.save(newAgent);
  }

  // Méthode pour désactiver un agent
  async deactivateAgent(id: number): Promise<AgentAssistance> {
    const agent = await this.getAgentById(id);
    agent.statut = 'inactif';
    agent.dateModification = new Date();
    return this.agentAssistanceRepository.save(agent);
  }

  // Méthode pour réactiver un agent
  async activateAgent(id: number): Promise<AgentAssistance> {
    const agent = await this.getAgentById(id);
    agent.statut = 'actif';
    agent.dateModification = new Date();
    return this.agentAssistanceRepository.save(agent);
  }
}