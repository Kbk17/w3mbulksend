// src/components/Header.tsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Box, Flex, Link, Text, Spacer, Button } from "@chakra-ui/react";

const Header = ({ setSigner }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const checkWalletConnection = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      setAddress(account);
      setSigner(signer);
    } catch (err) {
      setError("Failed to get wallet connection");
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

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
          <Button onClick={checkWalletConnection} ml={2} colorScheme="teal">
            Check Connection
          </Button>
          <w3m-button />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
