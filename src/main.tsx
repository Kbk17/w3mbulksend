import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider, useWeb3ModalError } from '@web3modal/ethers/react';
import Header from "./components/Header";
import BulkTransfer from "./components/BulkTransfer";
import "./styles.css";
import theme from "./theme";
import TextBox from "./components/TextBox";

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
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family': '"Roboto", sans-serif',
    '--w3m-accent': '#319795',
    '--w3m-color-mix': '#00BB7F',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-size-master': '16px',
    '--w3m-border-radius-master': '8px',
    '--w3m-z-index': 1000
  }
});

const App = () => {
  const [signer, setSigner] = useState(null);
  const { walletProvider } = useWeb3ModalProvider();
  const { error } = useWeb3ModalError();

  const checkWalletConnection = async () => {
    if (walletProvider) {
      try {
        const provider = new BrowserProvider(walletProvider);
        const signer = await provider.getSigner();
        setSigner(signer);
      } catch (err) {
        console.error('Failed to check wallet connection', err);
      }
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, [walletProvider]);

  useEffect(() => {
    if (error) {
      console.error('Web3Modal Error:', error.message);
    }
  }, [error]);

  return (
    <ChakraProvider theme={theme}>
      <div className="centered-div">
        <Header setSigner={setSigner} signer={signer} />
        <BulkTransfer signer={signer} setSigner={setSigner} />
      </div>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
