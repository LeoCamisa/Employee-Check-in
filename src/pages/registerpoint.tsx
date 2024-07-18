import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast, Flex, Text } from '@chakra-ui/react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { format, parseISO } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('pt-BR', ptBR);

const REGISTERED_TIMES_QUERY = gql`
  query GetRegisteredTimes($userId: Int!, $limit: Int, $offset: Int) {
    registeredTimes(userId: $userId, limit: $limit, offset: $offset) {
      id
      time_registered
      user {
        id
        name
        email
      }
    }
  }
`;

const USER_DETAILS_QUERY = gql`
  query GetUserDetails($userId: Int!) {
    user(id: $userId) {
      id
      name
    }
  }
`;

const CREATE_REGISTERED_TIME_MUTATION = gql`
  mutation CreateRegisteredTime($input: CreateRegisteredTimeInput!) {
    createRegisteredTime(input: $input) {
      id
      time_registered
      user {
        id
        name
      }
    }
  }
`;

const RegisterPointPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeRegistered, setTimeRegistered] = useState(new Date());
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();
  const toast = useToast();

  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('user_id');
      const storedRole = localStorage.getItem('role');
      setUserId(parseInt(storedUserId));
      setRole(storedRole);

      if (storedRole !== 'colaborador') {
        router.push('/');
      }
    }
  }, [router]);

  const { data, loading, error, refetch } = useQuery(REGISTERED_TIMES_QUERY, {
    variables: { userId: userId, limit, offset },
    skip: !userId,
  });

  const { data: userData } = useQuery(USER_DETAILS_QUERY, {
    variables: { userId: userId },
    skip: !userId,
  });

  useEffect(() => {
    if (userData) {
      setUserDetails(userData.user);
    }
  }, [userData]);

  const [createRegisteredTime] = useMutation(CREATE_REGISTERED_TIME_MUTATION, {
    onCompleted: () => {
      refetch();
      onClose();
      toast({
        title: "Registro bem-sucedido",
        description: "O ponto foi registrado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    },
    onError: (error) => {
      console.error('Erro ao registrar ponto:', error.message);
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro ao registrar o ponto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleRegister = async () => {
    try {
      const variables = {
        input: {
          time_registered: timeRegistered.toISOString(),
          userId: parseInt(userId)
        }
      };
      console.log('Enviando dados da mutação:', variables);

      await createRegisteredTime({ variables });
    } catch (error) {
      console.error('Erro ao registrar ponto:', error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    router.push('/');
  };

  const handleNextPage = () => {
    setOffset(offset + limit);
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar registros.</p>;

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="purple" position="fixed" bottom="20px" right="20px">Registrar</Button>
      <Button onClick={handleLogout} colorScheme="red" position="fixed" bottom="20px" left="20px">Sair</Button>
      <Table variant="striped" colorScheme="gray" size="sm" mt={4}>
        <Thead>
          <Tr>
            <Th>Colaborador</Th>
            <Th>Data</Th>
            <Th>Hora</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.registeredTimes.map((record) => (
            <Tr key={record.id}>
              <Td>{record.user.name}</Td>
              <Td>{format(parseISO(record.time_registered), 'dd/MM/yyyy')}</Td>
              <Td>{new Date(record.time_registered).toLocaleTimeString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justifyContent="space-between" mt={4} alignItems="center">
        <Button onClick={handlePreviousPage} disabled={offset === 0}>Anterior</Button>
        <Text>Página {currentPage}</Text>
        <Button onClick={handleNextPage}>Próximo</Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Registro</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Data/Hora</FormLabel>
              <DatePicker
                selected={timeRegistered}
                onChange={(date) => setTimeRegistered(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy, HH:mm"
                timeCaption="Hora"
                locale="pt-BR"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="purple" onClick={handleRegister}>Registrar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisterPointPage;