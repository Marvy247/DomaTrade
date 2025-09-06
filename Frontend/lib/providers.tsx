"use client";

import { getDefaultConfig, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Chain } from "wagmi/chains";
import React, { useState, useEffect } from "react";

const domaTestnet: Chain = {
  id: 97476,
  name: "DomaTrade Testnet",
  nativeCurrency: {
    name: "Doma",
    symbol: "DOMA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.doma.xyz"],
    },
    public: {
      http: ["https://rpc-testnet.doma.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "DomaTrade Explorer",
      url: "https://explorer-testnet.doma.xyz",
    },
  },
  testnet: true,
};

// Prevent multiple WalletConnect initializations
let configInstance: ReturnType<typeof getDefaultConfig> | null = null;

export const getConfig = () => {
  if (!configInstance) {
    configInstance = getDefaultConfig({
      appName: "DomaTrade",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
      chains: [domaTestnet],
      ssr: false, // Disable SSR for wallet connections
    });
  }
  return configInstance;
};

export const config = getConfig();

export const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {mounted ? children : <div>Loading...</div>}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
