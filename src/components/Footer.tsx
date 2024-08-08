import React from 'react';
import { Box, Flex, Text, Spacer, IconButton, Link } from "@chakra-ui/react";
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="gray.800" px={5} py={3} color="white" w="100%">
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
          <IconButton
            as="a"
            href="https://twitter.com"
            aria-label="Twitter"
            icon={<FaTwitter />}
            bg="gray.800"
            color="white"
            mx={1}
          />
          <IconButton
            as="a"
            href="https://linkedin.com"
            aria-label="LinkedIn"
            icon={<FaLinkedin />}
            bg="gray.800"
            color="white"
            mx={1}
          />
          <IconButton
            as="a"
            href="https://github.com"
            aria-label="GitHub"
            icon={<FaGithub />}
            bg="gray.800"
            color="white"
            mx={1}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
