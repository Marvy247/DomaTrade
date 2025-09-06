# DomaTrade

DomaTrade is a platform that brings institutional-grade trading tools to the domain name market. In today's digital economy, domain names are valuable assets that can appreciate significantly. Our platform makes domain trading accessible to everyone through a modern, real-time trading interface powered by blockchain technology.

## Features

- **Real-Time Trading Dashboard**: Live price feeds with professional-grade charts and market sentiment indicators
- **Advanced Order Book**: Institutional-level order book depth with live bid/ask spreads
- **Portfolio Management**: Track your domain portfolio with detailed analytics and performance metrics
- **Competition & Social Features**: Compete with other traders, climb leaderboards, and learn from the community
- **Mobile-First Design**: Fully responsive design optimized for all devices
- **Smart Contract Integration**: Secure transactions powered by Solidity smart contracts
- **Real-Time Architecture**: WebSocket connections for live data updates

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, React 19, Tailwind CSS
- **Blockchain**: Solidity, Foundry
- **Web3**: Wagmi, RainbowKit, Viem, Ethers
- **Charts**: Lightweight Charts, Recharts
- **Backend Services**: Node.js keepers for price updates and liquidation
- **UI Components**: Heroicons, React Hot Toast

## Prerequisites

- Node.js 18+
- Foundry (for smart contracts)
- Git

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd DomaTrade
```

2. Install frontend dependencies:
```bash
cd Frontend
npm install
```

3. Install contracts dependencies:
```bash
cd ../Contracts
forge install
```

4. Install keeper dependencies:
```bash
cd ../keeper
npm install
```

## Setup

1. Deploy smart contracts (from Contracts directory):
```bash
forge script script/Deploy.s.sol --rpc-url <your-rpc-url> --private-key <your-private-key> --broadcast
```

2. Update contract addresses in the frontend configuration

3. Configure environment variables for the frontend (create `.env.local`):
```env
NEXT_PUBLIC_RPC_URL=<your-rpc-url>
NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed-contract-address>
```

## Usage

1. Start the frontend development server:
```bash
cd Frontend
npm run dev
```

2. In a separate terminal, start the keeper services:
```bash
./run.sh
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Smart Contract Addresses

- **MockUSDC (dUSDC)**: `0x7880dd858Bedfb3Acc34006d7Ab96b3c152DF9DF`
- **OracleAdapter**: `0x2a3C594853706B43893F3f977815B03F622af78b`
- **CollateralVault**: `0x1E967705de6B18F8FC0b15697C86Fbe6010bE581`
- **DomainFutures**: `0x2cb425975626593A35D570C6E0bCEe53fca1eaFE`

## Project Structure

```
DomaTrade/
├── Contracts/          # Solidity smart contracts
│   ├── src/           # Contract source files
│   ├── test/          # Contract tests
│   └── script/        # Deployment scripts
├── Frontend/          # Next.js frontend application
│   ├── app/           # Next.js app router pages
│   ├── components/    # React components
│   └── lib/           # Utilities and configurations
├── keeper/            # Backend services for price updates and liquidation
└── demoscript.md      # Demo script for presentations
```

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Demo

For a quick overview of the platform's features, check out our [demo script](demoscript.md).

---

Built with ❤️ for the future of domain trading
