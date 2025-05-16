import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../utilisateur/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { User } from '../utilisateur/entities/user.entity';
import { MoyenEnvoiEnum } from 'src/utilisateur/entities/otp.entity';
import { UserEtablissementSante } from 'src/user_etablissement_sante/entities/user-etablissement-sante.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/utilisateur/dto/create-user.dto';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    // Pour la sacurité des transaction
    private configService: ConfigService,

    @InjectRepository(UserEtablissementSante)
    private userRepo: Repository<UserEtablissementSante>,
   
  ) {}

  async generateJwtTokenFromUser(user: User): Promise<string> {
    const payload = {
      id_user: user.id_user,
      email: user.email,
      telephone: user.telephone,
    };
  
    return this.jwtService.sign(payload);
  }
  

    async validateUser(identifier: string, password: string): Promise<{ user: User; access_token: string | null }> {

    //console.log(`🔐 Tentative de connexion avec l'identifiant : ${identifier}`);

    const user = await this.userService.findUserByIdentifier(identifier);

    if (!user || !user.mdp) {
      console.warn(`❌ Utilisateur introuvable ou mot de passe non défini pour : ${identifier}`);
      throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }

    //console.log(`✅ Utilisateur trouvé : ${user.id_user} (${user.email || user.telephone})`);
    

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.mdp);
    if (!isMatch) {
      console.warn(`❌ Mot de passe incorrect pour l'utilisateur : ${identifier}`);
      throw new BadRequestException('Identifiant ou mot de passe incorrect');
    }

    if (!user.compte_verifier) {
      await this.userService.generateOtp(identifier, MoyenEnvoiEnum.SMS); // ou EMAIL selon config
      return {
        user,
        access_token: null,
      };
    }

    const payload = { id_user: user.id_user, email: user.email };
    const access_token = this.jwtService.sign(payload);

    return {
      user,
      access_token,
    };
 
    
    }

    async sendOtpToUser(user: User) {
      await this.userService.generateAndSendOtp(user);
    }
    
    async validateUserEtablissementSante(identifiant: string, password: string): Promise<any> {
      const user = await this.userRepo.findOne({
        where: [
          { email: identifiant },
          { telephone: identifiant },
        ],
      });
    
      if (!user) return null;
    
      const isMatch = await bcrypt.compare(password, user.mot_de_passe);
      if (!isMatch) return null;
    
      const { mot_de_passe, ...rest } = user;
      return rest;
    }

    async login(user: any) {
      const payload = { id: user.id };
      return this.jwtService.sign(payload);
    }

    async loginEtablissement(user: any) {
      const payload = { id: user.id_user_etablissement_sante };
      return this.jwtService.sign(payload);
    }
    
    async register(identifier: string, code_invitation_utilise?: string) {
      return this.userService.registerUser(identifier, code_invitation_utilise);
    }
    
    

}