
import { Raffle, RaffleStatus, Order, Winner, TopBuyer } from '../types';

export const mockRaffles: Raffle[] = [
  {
    id: '1',
    title: 'Mega Sorteio da Virada - R$ 50.000,00',
    description: 'Comece 2024 com o pé direito! O maior prêmio do ano direto na sua conta via PIX.',
    prizeImage: 'https://images.unsplash.com/photo-1554224155-169641357599?auto=format&fit=crop&q=80&w=800',
    ticketPrice: 0.50,
    totalTickets: 100000,
    soldTickets: 78540,
    status: RaffleStatus.ACTIVE,
    drawDate: '2024-12-31T20:00:00',
    minTicketsPerUser: 5,
    maxTicketsPerUser: 5000,
    combos: [
      { amount: 100, price: 45.00, label: 'Combo Bronze' },
      { amount: 500, price: 200.00, label: 'Combo Prata' },
      { amount: 1000, price: 350.00, label: 'Combo Ouro' }
    ],
    luckyNumbers: [
      { number: '12345', prize: 'R$ 500,00', isFound: true, winnerName: 'Marcos A.' },
      { number: '77777', prize: 'R$ 1.000,00', isFound: false },
      { number: '00001', prize: 'R$ 200,00', isFound: false }
    ],
    lotteryResult: {
      contest: '5822',
      date: '2024-12-04',
      prizes: ['45892']
    },
    winnerTicket: 45892,
    winnerName: 'Carlos Oliveira'
  },
  {
    id: '2',
    title: 'iPhone 15 Pro Max + Apple Watch',
    description: 'Combo tecnológico para você renovar seus dispositivos no natal.',
    prizeImage: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    ticketPrice: 2.00,
    totalTickets: 10000,
    soldTickets: 4200,
    status: RaffleStatus.ACTIVE,
    drawDate: '2024-12-24T18:00:00',
    minTicketsPerUser: 5,
    maxTicketsPerUser: 500,
    combos: [
      { amount: 10, price: 18.00, label: '10% de Desconto' },
      { amount: 50, price: 80.00, label: '20% de Desconto' }
    ]
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ord_1',
    userId: 'u1',
    raffleId: '1',
    tickets: [12345, 12346, 12347, 12348, 12349],
    totalValue: 2.50,
    status: 'paid',
    createdAt: new Date().toISOString()
  }
];

export const mockWinners: Winner[] = [
  {
    id: 'w1',
    raffleId: '1',
    userName: 'Carlos Oliveira',
    ticketNumber: 45892,
    prizeName: 'R$ 50.000,00 no PIX',
    drawDate: '2024-12-04',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    testimonial: 'Nem acreditei quando conferi o resultado da Federal! Dinheiro caiu na hora via PIX. Gratidão total!',
    verifiedAt: '2024-12-04T20:15:00',
    location: 'São Paulo, SP'
  },
  {
    id: 'w2',
    raffleId: '0',
    userName: 'Maria Souza',
    ticketNumber: 12344,
    prizeName: 'PlayStation 5',
    drawDate: '2024-11-20',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    testimonial: 'Ganhei com apenas 10 cotinhas! Meu filho ficou muito feliz com o videogame novo.',
    verifiedAt: '2024-11-21T09:30:00',
    location: 'Curitiba, PR'
  },
  {
    id: 'w3',
    raffleId: '0',
    userName: 'Felipe Goulart',
    ticketNumber: 9921,
    prizeName: 'iPhone 15 Pro Max',
    drawDate: '2024-11-02',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    testimonial: 'Sempre participei e agora chegou minha vez. A plataforma é 100% séria e transparente.',
    verifiedAt: '2024-11-03T14:20:00',
    location: 'Belo Horizonte, MG'
  }
];

export const mockTopBuyers: TopBuyer[] = [
  { name: 'Ricardo M.', count: 1250 },
  { name: 'Ana Paula', count: 980 },
  { name: 'Felipe G.', count: 750 }
];