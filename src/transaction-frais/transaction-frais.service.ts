// transaction-frais.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionFrais, TransactionFraisType, ModePayment } from './entite/transaction-frais.entity';

@Injectable()
export class TransactionFraisService {
  constructor(
    @InjectRepository(TransactionFrais)
    private transactionFraisRepository: Repository<TransactionFrais>,
  ) {}

  // Trouver toutes les transactions de frais avec pagination
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await this.transactionFraisRepository.findAndCount({
      skip,
      take: limit,
      order: { date_creation: 'DESC' }
    });
    
    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Trouver une transaction de frais spécifique
  async findOne(id: number) {
    const transaction = await this.transactionFraisRepository.findOne({
      where: { id_frais: id }
    });
    
    if (!transaction) {
      throw new NotFoundException(`Transaction de frais avec ID ${id} non trouvée`);
    }
    
    return transaction;
  }

  // Trouver toutes les transactions de frais d'un utilisateur
  async findByUser(id_user: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    // Cette requête dépend de votre structure de données exacte
    // Vous devrez peut-être joindre d'autres tables pour obtenir id_user
    const [transactions, total] = await this.transactionFraisRepository.createQueryBuilder('frais')
      .innerJoin('frais.transaction', 'transaction')
      .innerJoin('transaction.compte', 'compte')
      .where('compte.id_user = :id_user', { id_user })
      .skip(skip)
      .take(limit)
      .orderBy('frais.date_creation', 'DESC')
      .getManyAndCount();
    
    return {
      transactions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  }

//   // Obtenir des statistiques globales
//   async getStats() {
//     // Statistiques par type de transaction
//     const statsByType = await this.transactionFraisRepository.createQueryBuilder('frais')
//       .select('frais.type_transaction', 'type')
//       .addSelect('COUNT(*)', 'count')
//       .addSelect('SUM(frais.montant_frais)', 'total')
//       .groupBy('frais.type_transaction')
//       .getRawMany();
    
//     // Statistiques par mode de paiement
//     const statsByMode = await this.transactionFraisRepository.createQueryBuilder('frais')
//       .select('frais.mode_paiement', 'mode')
//       .addSelect('COUNT(*)', 'count')
//       .addSelect('SUM(frais.montant_frais)', 'total')
//       .groupBy('frais.mode_paiement')
//       .getRawMany();
    
//     // Total global
//     const totalStats = await this.transactionFraisRepository.createQueryBuilder('frais')
//       .select('COUNT(*)', 'count')
//       .addSelect('SUM(frais.montant_frais)', 'total')
//       .getRawOne();
    
//     return {
//       statistique_somme_total_des_frais: totalStats,
//       stat_par_type_transaction: statsByType,
//       stat_par_mode_de_paiement: statsByMode
//     };
//   }










// transaction-frais.service.ts
async getStats() {
    // Statistiques par type de transaction
    const statsByType = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('frais.type_transaction', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .groupBy('frais.type_transaction')
      .getRawMany();
    
    // Statistiques par mode de paiement
    const statsByMode = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('frais.mode_paiement', 'mode')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .groupBy('frais.mode_paiement')
      .getRawMany();
    
    // Total global
    const totalStats = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .getRawOne();
    
    // Stats journalières (aujourd'hui)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const statistique_journalière = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: today })
      .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
      .getRawOne();
    
    // Stats hebdomadaires (7 derniers jours)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    
    const statistique_hebdomadaire = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: weekStart })
      .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
      .getRawOne();
    
    // Stats mensuelles (30 derniers jours)
    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 29);
    monthStart.setHours(0, 0, 0, 0);
    
    const statistique_mensuelle = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: monthStart })
      .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
      .getRawOne();
    
    // Stats annuelles (365 derniers jours)
    const yearStart = new Date();
    yearStart.setDate(yearStart.getDate() - 364);
    yearStart.setHours(0, 0, 0, 0);
    
    const statistique_annuelle = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: yearStart })
      .andWhere('frais.date_creation < :endDate', { endDate: tomorrow })
      .getRawOne();
    
    // Détail par jour sur les 7 derniers jours
    const dailyDetail = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select("to_char(frais.date_creation, 'DD-MM-YYYY')", 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: weekStart })
      .groupBy("to_char(frais.date_creation, 'DD-MM-YYYY')")
      .orderBy('date', 'ASC')
      .getRawMany();
    
    // Détail par mois sur l'année
    const monthlyDetail = await this.transactionFraisRepository.createQueryBuilder('frais')
      .select("to_char(frais.date_creation, 'MM-YYYY')", 'month')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('frais.date_creation >= :startDate', { startDate: yearStart })
      .groupBy("to_char(frais.date_creation, 'MM-YYYY')")
      .orderBy('month', 'ASC')
      .getRawMany();
    
    return {
      somme_totale_des_frais: totalStats,
      stat_par_type_transaction: statsByType,
      stat_par_mode_de_paiement: statsByMode,
    //   statistiques par periode
      stats_par_periode: {
        statistique_journalière: statistique_journalière,
        statistique_hebdomadaire: statistique_hebdomadaire,
        statistique_mensuelle: statistique_mensuelle,
        statistique_annuelle: statistique_annuelle,
      },
      details: {
        journalière: dailyDetail,
        mensuelle: monthlyDetail
      }
    };
  }
















  // Obtenir des statistiques pour un utilisateur spécifique
  async getUserStats(id_user: string) {
    // Statistiques par type de transaction pour cet utilisateur
    const statsByType = await this.transactionFraisRepository.createQueryBuilder('frais')
      .innerJoin('frais.transaction', 'transaction')
      .innerJoin('transaction.compte', 'compte')
      .select('frais.type_transaction', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('compte.id_user = :id_user', { id_user })
      .groupBy('frais.type_transaction')
      .getRawMany();
    
    // Statistiques par mode de paiement pour cet utilisateur
    const statsByMode = await this.transactionFraisRepository.createQueryBuilder('frais')
      .innerJoin('frais.transaction', 'transaction')
      .innerJoin('transaction.compte', 'compte')
      .select('frais.mode_paiement', 'mode')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('compte.id_user = :id_user', { id_user })
      .groupBy('frais.mode_paiement')
      .getRawMany();
    
    // Total pour cet utilisateur
    const totalStats = await this.transactionFraisRepository.createQueryBuilder('frais')
      .innerJoin('frais.transaction', 'transaction')
      .innerJoin('transaction.compte', 'compte')
      .select('COUNT(*)', 'count')
      .addSelect('SUM(frais.montant_frais)', 'total')
      .where('compte.id_user = :id_user', { id_user })
      .getRawOne();
    
    return {
      total: totalStats,
      byType: statsByType,
      byMode: statsByMode
    };
  }
}