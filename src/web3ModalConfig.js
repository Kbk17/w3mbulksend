// web3ModalConfig.js
import { defaultConfig, createWeb3Modal } from '@web3modal/ethers/react';

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) throw new Error("Project ID is undefined");

const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:1&projectId=${projectId}`
  },
  {
    chainId: 11155111,
    name: "Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:11155111&projectId=${projectId}`
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:42161&projectId=${projectId}`
  }
  // Dodaj tutaj więcej sieci
];

const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"]
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: "...",
  defaultChainId: 1
});

createWeb3Modal({
  ethersConfig,
  chains,
  projectId,
  enableAnalytics: true,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': '"Roboto", sans-serif',
    '--w3m-accent': '#319795',
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-size-master': '14px',  // Zmniejszono font-size
    '--w3m-border-radius-master': '8px',
    '--w3m-z-index': 1000,
    '--w3m-button-padding': '0.5rem 1rem',  // Zmniejszono padding
    '--w3m-button-font-size': '0.875rem'  // Zmniejszono font-size przycisku
  }
});

export { chains, ethersConfig };
