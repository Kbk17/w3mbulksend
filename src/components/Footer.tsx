import React from 'react';
import { Box, Flex, Link, Text } from '@chakra-ui/react';

const Footer = () => (
  <Box bg="gray.800" color="white" py={3} mt={10}>
    <Flex justify="center" align="center" flexDirection="column">
      <Text>&copy; 2024 BulkSender. All rights reserved.</Text>
      <Flex mt={2}>
        <Link href="#" mx={2}>
          Privacy Policy
        </Link>
        <Link href="#" mx={2}>
          Terms of Service
        </Link>
      </Flex>
    </Flex>
  </Box>
);