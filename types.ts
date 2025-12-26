
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
  rewardPoints?: number;
  lastSpinDate?: string;
  isRegisteredForYearEnd?: boolean;
  yearEndTicket?: string;
  hasSeenTour?: boolean; // Novo campo para controle de onboarding
  notifications?: AppNotification[];
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
  location?: string;
  // Fix: Added verifiedAt property to Winner interface to match mock data
  verifiedAt?: string;
}

export interface SlotSymbol {
  id: string;
  icon: string;
  multiplier: number;
  label: string;
  frequency: number;
}

// Fix: Added missing interfaces required by other components
export interface TopBuyer {
  name: string;
  count: number;
}

export interface WheelWin {
  id: string;
  userId: string;
  prizeId: number;
  createdAt: string;
}

export interface AffiliateAutomation {
  id: string;
  name: string;
  type: 'email' | 'whatsapp' | 'push';
  status: 'active' | 'inactive';
  description: string;
}

export interface DailyMission {
  title: string;
  description: string;
  reward: string;
}
