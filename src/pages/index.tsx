import { Box, VStack } from '@chakra-ui/react';

function LoginPage() {
  return (
    <Box
      bg="#F6F6F6"
      display="flex"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
    >
      <Box
        bg="white"
        p={5}
        borderRadius="lg"
        boxShadow="xl"
        w={{ base: "90%", md: 400 }}
        maxW="400px"
      >
        <VStack spacing={4} as="form">
          {}
        </VStack>
      </Box>
    </Box>
  );
}

export default LoginPage;