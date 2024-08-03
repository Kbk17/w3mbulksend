import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import { Box, Flex, Link, Text, Spacer } from "@chakra-ui/react";
import { useWeb3ModalProvider, useWeb3ModalError } from '@web3modal/ethers/react';

const Header = ({ setSigner }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const { walletProvider } = useWeb3ModalProvider();
  const { error: modalError } = useWeb3ModalError();

  const checkWalletConnection = async () => {
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const account = await signer.getAddress();
      setAddress(account);
      setSigner(signer);
    } catch (err) {
      setError("Failed to get wallet connection");
    }
  };

  useEffect(() => {
    if (walletProvider) {
      checkWalletConnection();
    }
  }, [walletProvider]);

  useEffect(() => {
    if (modalError) {
      setError(modalError.message);
    }
  }, [modalError]);

  return (
    <Box bg="gray.800" px={5} py={3} color="white">
      <Flex align="center">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Logo
          </Text>
        </Box>
        <Spacer />
        <Flex>
          <Link href="#about" mx={2} color="white">
            About
          </Link>
          <Link href="#collection" mx={2} color="white">
            Collection
          </Link>
          <Link href="#faq" mx={2} color="white">
            FAQs
          </Link>
        </Flex>
        <Spacer />
        <Flex align="center">
          {address ? (
            <Text mx={2} noOfLines={1} maxW="150px" isTruncated>
              {address}
            </Text>
          ) : (
            <Text>{error || "Wallet not connected"}</Text>
          )}
          <w3m-button />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
