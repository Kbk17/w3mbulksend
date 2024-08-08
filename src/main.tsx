import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { createWeb3Modal, defaultConfig, useWeb3ModalProvider, useWeb3ModalError } from '@web3modal/ethers/react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import BulkTransfer from "./components/BulkTransfer";
import BannerBox from "./components/BannerBox";
import "./styles.css";
import theme from "./theme";

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
  },
  {
    chainId: 43114,
    name: "Avalanche",
    currency: "AVAX",
    explorerUrl: "https://cchain.explorer.avax.network",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:43114&projectId=${projectId}`
  },
  {
    chainId: 42220,
    name: "Celo",
    currency: "CELO",
    explorerUrl: "https://explorer.celo.org",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:42220&projectId=${projectId}`
  },
  {
    chainId: 421614,
    name: "Arbitrum Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia.arbiscan.io",
    rpcUrl: `https://arb-sepolia.g.alchemy.com/v2/CgaowP7GettwbihFFjoo-y4X_huDxNoF`
  },
  {
    chainId: 250,
    name: "Fantom",
    currency: "FTM",
    explorerUrl: "https://ftmscan.com",
    rpcUrl: `https://rpc.walletconnect.org/v1/?chainId=eip155:250&projectId=${projectId}`
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
  themeMode: 'dark',
  themeVariables: {
    '--w3m-font-family': '"Roboto", sans-serif',
    '--w3m-accent': '#319795',
    '--w3m-color-mix': '#319795',
    '--w3m-color-mix-strength': 40,
    '--w3m-font-size-master': '10px',
    '--w3m-border-radius-master': "1px",
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
      <Box className="main">
        <Header setSigner={setSigner} />
        <Box className="centered-content">
          <BannerBox />
          <BulkTransfer signer={signer} setSigner={setSigner} />
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
