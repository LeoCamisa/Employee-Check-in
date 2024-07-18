import { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useToast, Flex, Spacer, HStack } from '@chakra-ui/react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { format, parseISO } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('pt-BR', ptBR);

const REGISTERED_TIMES_SUBSCRIPTION = gql`
  subscription OnRegisteredTimeAdded {
    registeredTimeAdded {
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

const ALL_REGISTERED_TIMES_QUERY = gql`
  query AllRegisteredTimes($limit: Int, $offset: Int) {
    allRegisteredTimes(limit: $limit, offset: $offset) {
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

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
      role
    }
  }
`;

const Dashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [timeRegistered, setTimeRegistered] = useState(new Date());
  const [userDetails, setUserDetails] = useState({});
  const router = useRouter();
  const toast = useToast();
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { data, loading, error, refetch, subscribeToMore } = useQuery(ALL_REGISTERED_TIMES_QUERY, {
    variables: { limit, offset },
  });

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.allRegisteredTimes.length / limit));
    }
  }, [data]);

  useEffect(() => {
    subscribeToMore({
      document: REGISTERED_TIMES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newRegisteredTime = subscriptionData.data.registeredTimeAdded;
        return Object.assign({}, prev, {
          allRegisteredTimes: [newRegisteredTime, ...prev.allRegisteredTimes]
        });
      }
    });
  }, [subscribeToMore]);

  const handleNextPage = () => {
    setOffset((prevOffset) => prevOffset + limit);
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setOffset((prevOffset) => Math.max(prevOffset - limit, 0));
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleCreateUser = async () => {
    try {
      await createUser({ variables: { input: { name, email, password, role } } });
      onCreateClose();
      toast({
        title: "Usuário criado",
        description: "O usuário foi criado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast({
        title: "Erro ao criar usuário",
        description: "Ocorreu um erro ao criar o usuário.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    router.push('/');
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar registros.</p>;

  return (
    <Box p={5}>
      <Flex mb={4}>
        <Button onClick={handleLogout} colorScheme="red" mr={4}>Sair</Button>
        <Spacer />
        <Button onClick={onCreateOpen} colorScheme="purple">Criar Usuário</Button>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            <Th>Colaborador</Th>
            <Th>Email</Th>
            <Th>Data</Th>
            <Th>Hora</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.allRegisteredTimes.map((record) => (
            <Tr key={record.id}>
              <Td>{record.user.name}</Td>
              <Td>{record.user.email}</Td>
              <Td>{format(parseISO(record.time_registered), 'dd/MM/yyyy')}</Td>
              <Td>{new Date(record.time_registered).toLocaleTimeString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex justify="center" align="center" mt={4}>
        <Button onClick={handlePreviousPage} disabled={page === 1} mr={4}>Anterior</Button>
        <Box>Página {page}</Box>
        <Button onClick={handleNextPage} disabled={page === totalPages} ml={4}>Próximo</Button>
      </Flex>
      <Modal isOpen={isCreateOpen} onClose={onCreateClose}>
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
            <Button colorScheme="purple" onClick={handleCreateUser}>Criar</Button>
            <Button variant="ghost" onClick={onCreateClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Dashboard;