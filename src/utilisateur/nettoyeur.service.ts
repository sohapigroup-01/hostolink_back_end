import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { User } from './entities/user.entity';

@Injectable()
export class OtpCleanerService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, 
  ) {}
    //   @Cron('*/2 * * * *') 
    //   @Cron(CronExpression.EVERY_MINUTE)
  @Cron(CronExpression.EVERY_MINUTE)
  async deleteExpiredOtps() {
    const now = new Date();
    const result = await this.otpRepository.delete({
      expires_at: LessThan(now),
      is_valid: true,
    });

    //console.log(`🧹 OTP expirés supprimés : ${result.affected} éléments`);
  }

  @Cron('0 0 * * *') // Tous les jours à 00h00
  async deleteUnverifiedUsers() {
    const now = new Date();
    const threshold = new Date(now.getTime() - 24 * 60 * 60 * 1000); 

    const result = await this.userRepository
      .createQueryBuilder()
      .delete()
      .from(User)
      .where('compte_verifier = false')
      .andWhere('date_inscription < :threshold', { threshold })
      .execute();

    // //console.log(`🗑️ Utilisateurs non vérifiés supprimés : ${result.affected}`);
  }
  

}
