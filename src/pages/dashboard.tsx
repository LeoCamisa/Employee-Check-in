import { useState, useEffect } from 'react';
import { Box, Button, Flex, Spacer, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');
      const storedRole = localStorage.getItem('role');
      setUserId(parseInt(storedUserId));
      setRole(storedRole);

      if (storedRole !== 'admin') {
        router.push('/');
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    router.push('/');
  };

  return (
    <Box p={5}>
      <Flex mb={4}>
        <Button onClick={handleLogout} colorScheme="red" mr={4}>Sair</Button>
        <Spacer />
        <Button onClick={onOpen} colorScheme="purple">Criar Usuário</Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Email</FormLabel>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Senha</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Função</FormLabel>
              <Input value={role} onChange={(e) => setRole(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple">Criar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;