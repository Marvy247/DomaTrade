import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrderbookOrder {
  price: number;
  quantity: number;
}

interface Orderbook {
  bids: OrderbookOrder[];
  asks: OrderbookOrder[];
}

interface Market {
  name: string;
}

export interface ExtendedMarket extends Market {
  domain: string;
  tld: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  orderbook: Orderbook;
}

interface Position {
  id: string;
  domain: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  pnl: number;
  stopLoss?: number;
  takeProfit?: number;
}

interface Order {
  id: string;
  domain: string;
  type: 'limit' | 'stop-loss' | 'take-profit';
  price: number;
  size: number;
  side: 'buy' | 'sell';
  status: 'pending' | 'executed' | 'cancelled';
  createdAt: number;
  executedAt?: number;
}

interface PendingOrder {
  id: string;
  domain: string;
  type: 'limit' | 'stop-loss' | 'take-profit';
  price: number;
  size: number;
  side: 'buy' | 'sell';
  createdAt: number;
}

interface Activity {
  id: string;
  domain: string;
  price: number;
  size: number;
  side: 'buy' | 'sell';
  timestamp: number;
  orderType?: 'market' | 'limit' | 'stop-loss' | 'take-profit';
}

interface Store {
  positions: Position[];
  orders: Order[];
  pendingOrders: PendingOrder[];
  activities: Activity[];
  markets: ExtendedMarket[];
  sidebarCollapsed: boolean;
  setMarkets: (markets: ExtendedMarket[]) => void;
  toggleSidebar: () => void;
  addPosition: (position: Omit<Position, 'id' | 'pnl'>) => void;
  removePosition: (id: string) => void;
  updatePnl: (id: string, pnl: number) => void;
  updatePositionStopLoss: (id: string, stopLoss: number) => void;
  updatePositionTakeProfit: (id: string, takeProfit: number) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  removeOrder: (id: string) => void;
  updateOrderStatus: (id: string, status: Order['status'], executedAt?: number) => void;
  addPendingOrder: (order: Omit<PendingOrder, 'id' | 'createdAt'>) => void;
  removePendingOrder: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'timestamp'>) => void;
  executePendingOrders: (currentPrices: Record<string, number>) => void;
  checkStopLossTakeProfit: (currentPrices: Record<string, number>) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      positions: [
        {
          id: '1',
          domain: 'crypto.eth',
          price: 2500,
          size: 2,
          side: 'buy' as const,
          pnl: 1250,
        },
        {
          id: '2',
          domain: 'defi.eth',
          price: 1800,
          size: 1.5,
          side: 'buy' as const,
          pnl: -225,
        },
        {
          id: '3',
          domain: 'nft.eth',
          price: 3200,
          size: 1,
          side: 'buy' as const,
          pnl: 800,
        },
        {
          id: '4',
          domain: 'ai.eth',
          price: 950,
          size: 3,
          side: 'buy' as const,
          pnl: 475,
        },
        {
          id: '5',
          domain: 'web3.eth',
          price: 1200,
          size: 2.5,
          side: 'sell' as const,
          pnl: -300,
        },
      ],
      orders: [
        {
          id: 'o1',
          domain: 'crypto.eth',
          type: 'limit' as const,
          price: 2400,
          size: 1.5,
          side: 'buy' as const,
          createdAt: Date.now() - 172800000,
          status: 'executed' as const,
          executedAt: Date.now() - 86400000,
        },
        {
          id: 'o2',
          domain: 'defi.eth',
          type: 'stop-loss' as const,
          price: 1750,
          size: 0.8,
          side: 'sell' as const,
          createdAt: Date.now() - 129600000,
          status: 'executed' as const,
          executedAt: Date.now() - 43200000,
        },
        {
          id: 'o3',
          domain: 'nft.eth',
          type: 'take-profit' as const,
          price: 3400,
          size: 0.6,
          side: 'buy' as const,
          createdAt: Date.now() - 86400000,
          status: 'pending' as const,
        },
        {
          id: 'o4',
          domain: 'ai.eth',
          type: 'limit' as const,
          price: 900,
          size: 2.0,
          side: 'buy' as const,
          createdAt: Date.now() - 43200000,
          status: 'cancelled' as const,
        },
        {
          id: 'o5',
          domain: 'web3.eth',
          type: 'limit' as const,
          price: 1150,
          size: 1.2,
          side: 'sell' as const,
          createdAt: Date.now() - 21600000,
          status: 'executed' as const,
          executedAt: Date.now() - 10800000,
        },
      ],
      pendingOrders: [
        {
          id: 'po1',
          domain: 'dao.eth',
          type: 'limit' as const,
          price: 650,
          size: 1.0,
          side: 'buy' as const,
          createdAt: Date.now() - 3600000,
        },
        {
          id: 'po2',
          domain: 'yield.eth',
          type: 'stop-loss' as const,
          price: 420,
          size: 0.5,
          side: 'sell' as const,
          createdAt: Date.now() - 1800000,
        },
      ],
      activities: [
        {
          id: 'a1',
          domain: 'crypto.eth',
          price: 2500,
          size: 1,
          side: 'buy' as const,
          timestamp: Date.now() - 86400000,
          orderType: 'market',
        },
        {
          id: 'a2',
          domain: 'defi.eth',
          price: 1800,
          size: 0.5,
          side: 'sell' as const,
          timestamp: Date.now() - 43200000,
          orderType: 'limit',
        },
        {
          id: 'a3',
          domain: 'nft.eth',
          price: 3200,
          size: 0.75,
          side: 'buy' as const,
          timestamp: Date.now() - 21600000,
          orderType: 'stop-loss',
        },
        {
          id: 'a4',
          domain: 'ai.eth',
          price: 950,
          size: 1.2,
          side: 'buy' as const,
          timestamp: Date.now() - 10800000,
          orderType: 'take-profit',
        },
        {
          id: 'a5',
          domain: 'web3.eth',
          price: 1200,
          size: 0.8,
          side: 'sell' as const,
          timestamp: Date.now() - 5400000,
          orderType: 'market',
        },
      ],
      markets: [],
      sidebarCollapsed: false,
      setMarkets: (markets) => set({ markets }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      addPosition: (position) =>
        set((state) => ({
          positions: [
            ...state.positions,
            { ...position, id: new Date().toISOString(), pnl: 0 },
          ],
        })),
      removePosition: (id) =>
        set((state) => ({
          positions: state.positions.filter((p) => p.id !== id),
        })),
      updatePnl: (id, pnl) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, pnl } : p
          ),
        })),
      updatePositionStopLoss: (id, stopLoss) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, stopLoss } : p
          ),
        })),
      updatePositionTakeProfit: (id, takeProfit) =>
        set((state) => ({
          positions: state.positions.map((p) =>
            p.id === id ? { ...p, takeProfit } : p
          ),
        })),
      addOrder: (order) =>
        set((state) => ({
          orders: [
            ...state.orders,
            { ...order, id: new Date().toISOString(), createdAt: Date.now(), status: 'pending' },
          ],
        })),
      removeOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== id),
        })),
      updateOrderStatus: (id, status, executedAt) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status, executedAt } : o
          ),
        })),
      addPendingOrder: (order) =>
        set((state) => ({
          pendingOrders: [
            ...state.pendingOrders,
            { ...order, id: new Date().toISOString(), createdAt: Date.now() },
          ],
        })),
      removePendingOrder: (id) =>
        set((state) => ({
          pendingOrders: state.pendingOrders.filter((o) => o.id !== id),
        })),
      addActivity: (activity) =>
        set((state) => ({
          activities: [
            ...state.activities,
            { ...activity, id: new Date().toISOString(), timestamp: Date.now() },
          ],
        })),
      executePendingOrders: (currentPrices) =>
        set((state) => {
          const executedOrders: PendingOrder[] = [];
          const remainingPendingOrders = state.pendingOrders.filter((order) => {
            const currentPrice = currentPrices[order.domain];
            if (!currentPrice) return true;

            let shouldExecute = false;
            if (order.type === 'limit') {
              if (order.side === 'buy' && currentPrice <= order.price) {
                shouldExecute = true;
              } else if (order.side === 'sell' && currentPrice >= order.price) {
                shouldExecute = true;
              }
            }

            if (shouldExecute) {
              executedOrders.push(order);
              return false;
            }
            return true;
          });

          // Convert executed pending orders to positions
          const newPositions = executedOrders.map((order) => ({
            id: new Date().toISOString(),
            domain: order.domain,
            price: order.price,
            size: order.size,
            side: order.side,
            pnl: 0,
          }));

          // Add executed orders to order history
          const newOrderHistory = executedOrders.map((order) => ({
            id: new Date().toISOString(),
            domain: order.domain,
            type: order.type as 'limit' | 'stop-loss' | 'take-profit',
            price: order.price,
            size: order.size,
            side: order.side,
            createdAt: order.createdAt,
            status: 'executed' as const,
            executedAt: Date.now(),
          }));

          return {
            pendingOrders: remainingPendingOrders,
            positions: [...state.positions, ...newPositions],
            orders: [...state.orders, ...newOrderHistory],
          };
        }),
      checkStopLossTakeProfit: (currentPrices) =>
        set((state) => {
          const positionsToClose: Position[] = [];
          const updatedPositions = state.positions.map((position) => {
            const currentPrice = currentPrices[position.domain];
            if (!currentPrice) return position;

            let shouldClose = false;
            let closeReason = '';

            if (position.side === 'buy') {
              if (position.stopLoss && currentPrice <= position.stopLoss) {
                shouldClose = true;
                closeReason = 'stop-loss';
              } else if (position.takeProfit && currentPrice >= position.takeProfit) {
                shouldClose = true;
                closeReason = 'take-profit';
              }
            } else if (position.side === 'sell') {
              if (position.stopLoss && currentPrice >= position.stopLoss) {
                shouldClose = true;
                closeReason = 'stop-loss';
              } else if (position.takeProfit && currentPrice <= position.takeProfit) {
                shouldClose = true;
                closeReason = 'take-profit';
              }
            }

            if (shouldClose) {
              positionsToClose.push(position);
              return { ...position, pnl: position.pnl }; // Keep existing PNL
            }

            return position;
          });

          // Remove closed positions
          const remainingPositions = updatedPositions.filter(
            (pos) => !positionsToClose.some((closed) => closed.id === pos.id)
          );

          return {
            positions: remainingPositions,
          };
        }),
    }),
    {
      name: 'domatrade-storage',
      partialize: (state) => ({
        positions: state.positions,
        orders: state.orders,
        pendingOrders: state.pendingOrders,
        activities: state.activities
      }),
    }
  )
);
