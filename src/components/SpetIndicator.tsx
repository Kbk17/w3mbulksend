import React from 'react';
import { Box, Flex, Text, VStack, Icon } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const StepIndicator = ({ currentStep }) => {
  const steps = ['Prepare', 'Approve', 'Send'];

  return (
    <Flex justify="center" mb={5}>
      {steps.map((step, index) => (
        <VStack key={index} mx={2}>
          <Icon
            as={CheckCircleIcon}
            color={currentStep > index ? 'green.500' : 'gray.500'}
            boxSize={8}
          />
          <Text color={currentStep > index ? 'green.500' : 'gray.500'}>
            {step}
          </Text>
        </VStack>
      ))}
    </Flex>
  );
};

export default StepIndicator;
