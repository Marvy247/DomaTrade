export interface CompetitionParticipant {
  id: string;
  address: string;
  displayName: string;
  totalPnL: number;
  winRate: number;
  volumeTraded: number;
  rank: number;
  avatar?: string;
  isETFParticipant: boolean;
}

export interface ETFWhitelistedOption {
  id: string;
  domainName: string;
  yieldPercentage: number;
  category: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  minInvestment: number;
  participants: number;
  totalValueLocked: number;
}

export interface CompetitionStats {
  totalParticipants: number;
  totalPrizePool: number;
  competitionDuration: string;
  startDate: string;
  endDate: string;
}

export const mockCompetitionParticipants: CompetitionParticipant[] = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D4e6D3b6e8d3e8A0',
    displayName: 'CryptoWhale',
    totalPnL: 45230.75,
    winRate: 78.5,
    volumeTraded: 1250000,
    rank: 1,
    isETFParticipant: true,
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c82C3e8C9',
    displayName: 'DeFiMaster',
    totalPnL: 38900.25,
    winRate: 72.3,
    volumeTraded: 980000,
    rank: 2,
    isETFParticipant: true,
  },
  {
    id: '3',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    displayName: 'DomainTrader',
    totalPnL: 28450.50,
    winRate: 68.9,
    volumeTraded: 750000,
    rank: 3,
    isETFParticipant: false,
  },
  {
    id: '4',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    displayName: 'YieldHunter',
    totalPnL: 22100.00,
    winRate: 65.2,
    volumeTraded: 620000,
    rank: 4,
    isETFParticipant: true,
  },
  {
    id: '5',
    address: '0x5678901234567890abcdef1234567890abcdef34',
    displayName: 'SmartMoney',
    totalPnL: 18900.75,
    winRate: 61.8,
    volumeTraded: 480000,
    rank: 5,
    isETFParticipant: false,
  },
];

export const mockETFWhitelistedOptions: ETFWhitelistedOption[] = [
  {
    id: '1',
    domainName: 'defi-blue-chip.eth',
    yieldPercentage: 12.5,
    category: 'DeFi Blue Chips',
    riskLevel: 'Medium',
    minInvestment: 1000,
    participants: 245,
    totalValueLocked: 2450000,
  },
  {
    id: '2',
    domainName: 'gaming-metaverse.eth',
    yieldPercentage: 18.3,
    category: 'Gaming & Metaverse',
    riskLevel: 'High',
    minInvestment: 500,
    participants: 189,
    totalValueLocked: 945000,
  },
  {
    id: '3',
    domainName: 'infrastructure.eth',
    yieldPercentage: 8.7,
    category: 'Infrastructure',
    riskLevel: 'Low',
    minInvestment: 2000,
    participants: 312,
    totalValueLocked: 6240000,
  },
  {
    id: '4',
    domainName: 'nft-collections.eth',
    yieldPercentage: 22.1,
    category: 'NFT Collections',
    riskLevel: 'High',
    minInvestment: 750,
    participants: 156,
    totalValueLocked: 1170000,
  },
  {
    id: '5',
    domainName: 'dao-governance.eth',
    yieldPercentage: 15.8,
    category: 'DAO Governance',
    riskLevel: 'Medium',
    minInvestment: 1500,
    participants: 278,
    totalValueLocked: 4170000,
  },
];

export const competitionStats: CompetitionStats = {
  totalParticipants: 1247,
  totalPrizePool: 50000,
  competitionDuration: '30 days',
  startDate: '2024-01-01',
  endDate: '2024-01-31',
};
