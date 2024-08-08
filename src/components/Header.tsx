import React, { useState, useEffect } from "react";
import { ethers, BrowserProvider } from "ethers";
import {
  Box,
  Flex,
  Link,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Image,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Container,
} from "@chakra-ui/react";
import { ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useWeb3ModalProvider, useWeb3ModalError } from '@web3modal/ethers/react';

const Header = ({ setSigner }) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const { walletProvider } = useWeb3ModalProvider();
  const { error: modalError } = useWeb3ModalError();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <Box bg="gray.800" color="white" w="100%">
      <Container maxW="1440px" px={5} py={3}>
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Image src="/src/assets/logo1.png" alt="Logo" boxSize="48px" mr={3} />
            <Text fontSize="2xl" fontWeight="bold">
              Send Tokens
            </Text>
          </Flex>
          <Flex display={{ base: 'none', md: 'flex' }} align="center" ml="auto">
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="link" color="white" mx={2}>
                Products
              </MenuButton>
              <MenuList>
                <MenuItem>Product 1</MenuItem>
                <MenuItem>Product 2</MenuItem>
              </MenuList>
            </Menu>
            <Link href="#faq" mx={2} color="white">
              FAQ
            </Link>
            <Link href="#tutorial" mx={2} color="white">
              Tutorial
            </Link>
            <Box mx={2}>
              <w3m-network-button />
            </Box>
            <Box mx={2}>
              <w3m-button />
            </Box>
          </Flex>
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
          />
        </Flex>
      </Container>

      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody>
              <VStack spacing={4} align="flex-start">
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="link" color="white">
                    Products
                  </MenuButton>
                  <VStack spacing={2} align="flex-start" pl={4}>
                    <Link href="#product1" onClick={onClose}>Product 1</Link>
                    <Link href="#product2" onClick={onClose}>Product 2</Link>
                  </VStack>
                </Menu>
                <Link href="#faq" color="white" onClick={onClose}>
                  FAQ
                </Link>
                <Link href="#tutorial" color="white" onClick={onClose}>
                  Tutorial
                </Link>
                <Button variant="outline" width="100%" onClick={onClose}>
                  <w3m-network-button />
                </Button>
                <Button variant="outline" width="100%" onClick={onClose}>
                  <w3m-button />
                </Button>
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </Box>
  );
};

export default Header;
