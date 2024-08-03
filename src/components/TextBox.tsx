import React from 'react';
import { Box, Heading, Text, Button, Stack } from '@chakra-ui/react';

const TextBox: React.FC = () => (
  <Box textAlign="center" py={10} px={5} bg="gray.800" color="white">
    <Heading as="h2" size="xl" mb={4}>
      Bulk Transaction Sender
    </Heading>
    <Text fontSize="lg" mb={8}>
      Send multiple transactions in a single shot! Perfect for airdrops, payrolls, and more.
    </Text>
    <Stack direction="row" spacing={4} justify="center">
      <Button colorScheme="teal" size="lg">
        Get Started
      </Button>
      <Button variant="outline" colorScheme="teal" size="lg">
        Learn More
      </Button>
    </Stack>
  </Box>
);

export default TextBox;
