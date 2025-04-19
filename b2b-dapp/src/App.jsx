import React from 'react';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';

function App() {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, teal.200, blue.100)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <VStack
        spacing={6}
        bg="white"
        p={10}
        borderRadius="2xl"
        boxShadow="lg"
        maxW="md"
        textAlign="center"
      >
        <Heading color="teal.600">🚀 Hello B2B Blockchain World!</Heading>
        <Text fontSize="lg" color="gray.600">
          You made it past the white screen! 🎉
        </Text>
        <Button colorScheme="teal" size="lg">
          Let’s Go!
        </Button>
      </VStack>
    </Box>
  );
}

export default App;
