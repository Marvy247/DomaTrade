
export interface Order {
  price: number;
  quantity: number;
}

export interface Orderbook {
  bids: Order[];
  asks: Order[];
}

export interface Market {
  name: string;
  orderbook: Orderbook;
}

export const generateOrderbook = (): Orderbook => {
  const bids: Order[] = [];
  const asks: Order[] = [];

  let lastBidPrice = 100 + Math.random() * 50;
  let lastAskPrice = lastBidPrice + 0.5 + Math.random() * 5;

  for (let i = 0; i < 20; i++) {
    lastBidPrice -= Math.random() * 2;
    bids.push({
      price: parseFloat(lastBidPrice.toFixed(2)),
      quantity: Math.floor(Math.random() * 1000) + 100,
    });

    lastAskPrice += Math.random() * 2;
    asks.push({
      price: parseFloat(lastAskPrice.toFixed(2)),
      quantity: Math.floor(Math.random() * 1000) + 100,
    });
  }

  return { bids, asks };
};

export const marketsData: Market[] = [
  {
    name: 'crypto.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'defi.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'nft.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'game.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'metaverse.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'ai.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'web3.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'dao.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'yield.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'social.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'music.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'art.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'sports.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'finance.eth',
    orderbook: { bids: [], asks: [] },
  },
  {
    name: 'tech.eth',
    orderbook: { bids: [], asks: [] },
  },
];

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  pnl: number;
  volume: number;
}

export const leaderboardData: LeaderboardUser[] = [
  {
    id: '1',
    name: 'CryptoKing',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    pnl: 125000.50,
    volume: 8500000,
  },
  {
    id: '2',
    name: 'DeFiQueen',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
    pnl: 98000.75,
    volume: 12000000,
  },
  {
    id: '3',
    name: 'NFTWhale',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
    pnl: 75000.00,
    volume: 6500000,
  },
  {
    id: '4',
    name: 'GameFiGod',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
    pnl: 52000.25,
    volume: 4500000,
  },
  {
    id: '5',
    name: 'MetaverseMogul',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
    pnl: 31000.00,
    volume: 9800000,
  },
];

export interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const basePrices: Record<string, number> = {
  'crypto.eth': 100,
  'defi.eth': 200,
  'nft.eth': 300,
  'game.eth': 400,
  'metaverse.eth': 500,
  'ai.eth': 150,
  'web3.eth': 250,
  'dao.eth': 350,
  'yield.eth': 450,
  'social.eth': 550,
  'music.eth': 175,
  'art.eth': 275,
  'sports.eth': 375,
  'finance.eth': 475,
  'tech.eth': 575,
};

export const generateChartData = (market: string = 'crypto.eth'): ChartData[] => {
  const data: ChartData[] = [];
  const basePrice = basePrices[market] || basePrices['crypto.eth'];
  let lastPrice = basePrice + Math.random() * 50;
  const startTime = new Date();
  startTime.setDate(startTime.getDate() - 365);

  for (let i = 0; i < 365; i++) {
    const open = lastPrice;
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const time = new Date(startTime.getTime() + i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    data.push({ time, open, high, low, close });
    lastPrice = close;
  }

  return data;
};

export const generateRealtimeData = (): ChartData => {
  const now = new Date();
  const time = now.toISOString().slice(0, 10); // Use date format for compatibility
  const basePrice = 100 + Math.random() * 50;
  const volatility = 0.02;
  const open = basePrice;
  const close = open + (Math.random() - 0.5) * volatility * basePrice;
  const high = Math.max(open, close) + Math.random() * volatility * basePrice * 0.5;
  const low = Math.min(open, close) - Math.random() * volatility * basePrice * 0.5;

  return {
    time,
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
  };
};
