// src/components/Hero.tsx
import React from 'react';
import { Box, Heading, Text, Button, Image } from '@chakra-ui/react';

const Hero = () => (
  <Box textAlign="center" py={10} bg="gray.800" color="white">
    <Heading as="h1" size="2xl" mb={4}>
      Bulk Transaction Sender
    </Heading>
    <Text fontSize="lg" mb={4}>
      Send multiple transactions at once!
    </Text>
    <Box
      position="relative"
      bg="teal.500"
      color="white"
      p={4}
      borderRadius="md"
      mb={8}
      mx="auto"
      maxWidth="500px"
      boxShadow="lg"
    >
      <Image
        src="/path/to/placeholder.png" // Replace with the actual path to your placeholder image
        alt="Placeholder"
        borderRadius="md"
        opacity={0.3}
        width="100%"
        height="auto"
      />
      <Text position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" textAlign="center">
        Efficient, fast, and secure transactions on your favorite blockchains.
      </Text>
    </Box>
    <Button colorScheme="teal" size="lg">
      Start Sending
    </Button>
  </Box>
);

export default Hero;
