
export enum RaffleStatus {
  ACTIVE = 'active',
  DRAWN = 'drawn',
  PAUSED = 'paused'
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
  link?: string;
}

export interface LuckyNumber {
  number: string;
  prize: string;
  winnerName?: string;
  isFound: boolean;
}

export interface RaffleCombo {
  amount: number;
  price: number;
  label: string;
}

export interface LotteryResult {
  contest: string;
  date: string;
  prizes: string[]; 
}

export interface Raffle {
  id: string;
  title: string;
  description: string;
  prizeImage: string;
  ticketPrice: number;
  totalTickets: number;
  soldTickets: number;
  status: RaffleStatus;
  drawDate: string;
  minTicketsPerUser: number;
  maxTicketsPerUser: number;
  combos?: RaffleCombo[];
  luckyNumbers?: LuckyNumber[];
  winnerTicket?: number;
  winnerName?: string;
  lotteryResult?: LotteryResult;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  pixKey: string;
  status: 'pending' | 'paid' | 'rejected';
  createdAt: string;
}

export interface WheelWin {
  id: string;
  userId: string;
  userName: string;
  prizeLabel: string;
  prizeValue: number;
  prizeType: string;
  createdAt: string;
}

export interface SlotSymbol {
  id: string;
  icon: string; // Emoji ou URL
  multiplier: number;
  label: string;
  frequency: number; // Peso para RNG (1-100)
}

export interface AffiliateAutomation {
  id: string;
  name: string;
  type: 'email' | 'push' | 'whatsapp';
  status: 'active' | 'inactive';
  description: string;
}

export interface ActiveDiscount {
  id: string;
  percentage: number;
  expiresAt: string;
}

export interface DailyMission {
  title: string;
  description: string;
  reward: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string; 
  role: 'admin' | 'user';
  createdAt: string;
  status?: 'active' | 'inactive';
  avatarUrl?: string;
  isAffiliate?: boolean;
  affiliateCode?: string;
  referredBy?: string;
  totalEarned?: number;
  currentBalance?: number;
  totalReferralSales?: number;
  referralCount?: number;
  bonusTicketsCount?: number;
  automations?: AffiliateAutomation[];
  rewardPoints?: number;
  lastSpinDate?: string;
  activeDiscounts?: ActiveDiscount[];
  notifications?: AppNotification[];
  isRegisteredForYearEnd?: boolean;
  yearEndTicket?: string;
  hasSeenTour?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName?: string;
  raffleId: string;
  tickets: number[];
  totalValue: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  affiliateId?: string;
  isBonus?: boolean;
}

export interface Winner {
  id: string;
  raffleId: string;
  userId?: string;
  userName: string;
  ticketNumber: number;
  prizeName: string;
  drawDate: string;
  imageUrl?: string;
  testimonial?: string;
  verifiedAt?: string;
  location?: string;
}

export interface TopBuyer {
  name: string;
  count: number;
}