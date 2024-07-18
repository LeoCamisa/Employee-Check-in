import { Box, VStack, FormControl, FormLabel, Input, Button, Image, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      role
      user_name
      user_id
    }
  }
`;

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({ variables: { input: { email, password } } });
      if (data && data.login && data.login.access_token) {
        localStorage.setItem('token', data.login.access_token);
        localStorage.setItem('user_name', data.login.user_name);
        localStorage.setItem('user_id', data.login.user_id);
        localStorage.setItem('role', data.login.role);
        
        toast({
          title: "Logado com sucesso",
          description: "Você está acessando o sistema.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });

        const redirectTo = data.login.role === 'admin' ? '/dashboard' : '/registerpoint';
        console.log('Redirecting to:', redirectTo);
        router.push(redirectTo);
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      toast({
        title: "Ocorreu um erro.",
        description: "Senha ou Usuario invalido.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      console.error('Login error:', error);
    }
  };

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
        <VStack spacing={4} as="form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <Image src="https://telegra.ph/file/52917b79f053097f1f42f.png" alt="Logo" boxSize="250px" />
          <Text fontSize="xl" fontWeight="bold">LOGIN</Text>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@efficlin.com" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Senha</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <Button type="submit" colorScheme="purple" w="full" mt={4} isLoading={loading}>Entrar</Button>
          {error && <Text color="red.500" fontSize="sm" textAlign="center">Error: {error.message}</Text>}
          <Text color="gray.500" fontSize="sm" textAlign="center">
            Bem vindo ao register pointer
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default LoginPage;