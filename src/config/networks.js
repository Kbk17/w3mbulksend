// src/config/networks.js
const networks = {
    1: {
      name: "Ethereum",
      currency: "ETH",
      explorerUrl: "https://etherscan.io",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:1&projectId=${projectId}`
    },
    11155111: {
      name: "Sepolia",
      currency: "ETH",
      explorerUrl: "https://sepolia.etherscan.io",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:11155111&projectId=${projectId}`
    },
    42161: {
      name: "Arbitrum One",
      currency: "ETH",
      explorerUrl: "https://arbiscan.io",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:42161&projectId=${projectId}`
    },
    43114: {
      name: "Avalanche",
      currency: "AVAX",
      explorerUrl: "https://cchain.explorer.avax.network",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:43114&projectId=${projectId}`
    },
    42220: {
      name: "Celo",
      currency: "CELO",
      explorerUrl: "https://explorer.celo.org",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:42220&projectId=${projectId}`
    },
    421614: {
      name: "Arbitrum Sepolia",
      currency: "ETH",
      explorerUrl: "https://sepolia.arbiscan.io",
      rpcUrl: () => `https://arb-sepolia.g.alchemy.com/v2/CgaowP7GettwbihFFjoo-y4X_huDxNoF`
    },
    250: {
      name: "Fantom",
      currency: "FTM",
      explorerUrl: "https://ftmscan.com",
      rpcUrl: (projectId) => `https://rpc.walletconnect.org/v1/?chainId=eip155:250&projectId=${projectId}`
    }
  };
  
  export default networks;
  