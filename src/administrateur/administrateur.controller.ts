import { 
  Controller, 
  Post, 
  Body, 
  HttpException, 
  HttpStatus, 
  Get,
  UseGuards,
  Request,
  Param,
  UploadedFile,
  UseInterceptors,
  Delete,
  UnauthorizedException,
  Patch,
  BadRequestException,
  Query,
  NotFoundException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdministrateurDto } from './dto/create-administrateur.dto';
import { AdministrateurService } from './administrateur.service';
import { LoginAdministrateurDto } from './dto/login-administrateur.dto';
import { JwtAdminGuard } from '../auth/jwt-auth.guard';
import { DataSource } from 'typeorm';

@Controller('administrateurs')
export class AdministrateurController {
  constructor(
    private readonly administrateurService: AdministrateurService,
    private readonly adminService: AdministrateurService,
    private readonly dataSource: DataSource,

  ) {}
  @Post('inscription')
  async inscrireAdmin(@Body() dto: CreateAdministrateurDto) {
    try {
      return await this.adminService.inscrireAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() dto: LoginAdministrateurDto) {
    try {
      return await this.adminService.connexionAdministrateur(dto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
  
  @Get('me')
  @UseGuards(JwtAdminGuard)
  async getMe(@Request() req) {
    return this.adminService.getAdminById(req.user.id_admin_gestionnaire);
  }

  // ✅ Endpoint ajouté pour upload avatar
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar', { dest: './uploads' }))
  async uploadAvatar(
    @Param('id') id: number,


    
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    try {
      return await this.adminService.uploadAvatarAdmin(id, avatar);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  async supprimerAdministrateur(@Param('id') id: number) {
    return this.adminService.supprimerAdministrateur(id);
  }

  @Delete(':id/supprimer')
  @UseGuards(JwtAdminGuard) // seul un super admin peut exécuter cette action
  async supprimerAdminParSuperAdmin(@Param('id') id: number, @Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.supprimerAdministrateur(id);
  }

  @Patch(':id/statut')
  @UseGuards(JwtAdminGuard)
  async modifierStatutAdmin(
    @Param('id') id: number,
    @Body('statut') statut: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.modifierStatutAdministrateur(id, statut);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  async modifierAdministrateur(
    @Param('id') id: number,
    @Body() dto: Partial<CreateAdministrateurDto>,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.modifierAdministrateur(id, dto);
  }

  @Get()
  @UseGuards(JwtAdminGuard)
  async recupererAdmins(@Request() req) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.recupererTousLesAdmins();
  }


  @Get(':id/details')
  @UseGuards(JwtAdminGuard)
  async afficherDetailsAdmin(
    @Param('id') id: number,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }
    return this.adminService.getAdminById(id);
  }


  @Patch(':id/mot-de-passe')
  @UseGuards(JwtAdminGuard)
  async modifierMotDePasse(
    @Param('id') id: number,
    @Body('nouveau_mot_de_passe') nouveauMotDePasse: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.modifierMotDePasseAdmin(id, nouveauMotDePasse);
  }


  @Patch(':id/permissions')
  @UseGuards(JwtAdminGuard)
  async attribuerPermissions(
    @Param('id') id: number,
    @Body('permissions') permissions: Record<string, any>,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.modifierPermissionsAdmin(id, permissions);
  }

  @Get('role/:role')
  @UseGuards(JwtAdminGuard)
  async rechercherAdminParRole(
    @Param('role') role: string,
    @Request() req,
  ) {
    if (req.user.role !== 'super_admin') {
      throw new UnauthorizedException('Accès réservé au super administrateur.');
    }

    return this.adminService.rechercherParRole(role);
  }
  @UseGuards(JwtAdminGuard)
  @Post('crediter-utilisateur')
  async crediterUtilisateur(
    @Request() req,
    @Body() body: { id_user: string; montant: number },
  ) {
    const idAdmin = req.user.id_admin_gestionnaire;
    return this.adminService.crediterUtilisateur(body.id_user, body.montant, idAdmin);
  }
  
  

  @Post('crediter-etablissement')
  @UseGuards(JwtAdminGuard)
  async crediterEtablissement(
    @Body('id_etab') id: number,
    @Body('montant') montant: number,
    @Request() req,
  ) {
    if (!id || !montant) {
      throw new BadRequestException('ID et montant requis');
    }
    return this.administrateurService.crediterEtablissement(id, montant, req.user.id_admin_gestionnaire);
  }

  @Get('etablissements')
  @UseGuards(JwtAdminGuard)
  async getAllEtablissements() {
    return this.administrateurService.findAllEtablissements();
  }

  // Recharge utilisateur par identifiant
  @UseGuards(JwtAdminGuard)
  @Post('recharger-user')
  rechargerUser(@Request() req, @Body() body: { identifiant: string; montant: number }) {
    return this.adminService.rechargerUser(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
  }
  
  @UseGuards(JwtAdminGuard)
  @Post('recharger-etablissement')
  rechargerEtablissement(@Request() req, @Body() body: { identifiant: string; montant: number }) {
    return this.adminService.rechargerEtablissement(body.identifiant, body.montant, req.user.id_admin_gestionnaire);
  }

  // 🔹 Récupérer tous les rechargements
    @Get('rechargements')
    getAllRechargements() {
      return this.administrateurService.getAllRechargements();
    }

    // 🔹 Total des frais de transaction
    @Get('transactions/frais-total')
    getTotalFraisTransactions() {
      return this.administrateurService.getTotalFraisTransactions();
    }

    @Get('utilisateur/find')
    @UseGuards(JwtAdminGuard)
    async findUser(
      @Request() req,
      @Query('identifiant') identifiant: string,
      @Query('type') type: string,
    ) {
      return this.adminService.rechercherUtilisateurParIdentifiant(identifiant, type);
    }
    
    
    // DEV ENDPOINT DE RECHARGEMENT PAR TOKEN DE QRCODE D'USER
    
    @Get('qr-code-dynamique/verifier')
    @UseGuards(JwtAdminGuard)
    async verifierTokenDynamique(@Query('token') token: string) {
      const [qr] = await this.dataSource.query(
        `SELECT * FROM qr_code_paiement_dynamique WHERE token = $1 LIMIT 1`,
        [token]
      );
      if (!qr) throw new NotFoundException("QR dynamique introuvable");
      return { id_user: qr.id_user };
    }
    
    @Get('qr-code-statique/verifier')
    @UseGuards(JwtAdminGuard)
    async verifierTokenStatique(@Query('token') token: string) {
      const [qr] = await this.dataSource.query(
        `SELECT * FROM qr_code_paiement_statique WHERE token = $1 LIMIT 1`,
        [token]
      );
      if (!qr) throw new NotFoundException("QR statique introuvable");
      return { id_user: qr.id_user };
    }
    
  // ------------- RETAIT DES ES ET USERS

  @UseGuards(JwtAdminGuard)
  @Post('retirer-user')
  async retirerUser(
    @Request() req,
    @Body() body: { identifiant: string; montant: number },
  ) {
    const { identifiant, montant } = body;
    const idAdmin = req.user.id_admin_gestionnaire;

    // Trouver l'utilisateur par email, téléphone ou UUID
    const user = await this.adminService.rechercherUtilisateurParIdentifiant(identifiant, 'uuid');
    return this.adminService.retirerUtilisateur(user.id_user, montant, idAdmin);
  }

  @UseGuards(JwtAdminGuard)
  @Post('retirer-etablissement')
  async retirerEtablissement(
    @Request() req,
    @Body() body: { identifiant: string; montant: number },
  ) {
    const { identifiant, montant } = body;
    const idAdmin = req.user.id_admin_gestionnaire;

    // Trouver l'établissement par email ou téléphone
    const [etab] = await this.dataSource.query(
      `SELECT * FROM user_etablissement_sante WHERE email = $1 OR telephone = $1 OR id_user_etablissement_sante::text = $1 LIMIT 1`,
      [identifiant],
    );
    if (!etab) throw new NotFoundException('Établissement introuvable');

    return this.adminService.retirerEtablissement(etab.id_user_etablissement_sante, montant, idAdmin);
  }



}
