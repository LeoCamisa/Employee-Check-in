import { useState, useEffect } from 'react';
import { Box, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import DatePicker, { registerLocale } from 'react-datepicker';
import ptBR from 'date-fns/locale/pt-BR';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('pt-BR', ptBR);

const RegisterPointPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timeRegistered, setTimeRegistered] = useState(new Date());
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);

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

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    router.push('/');
  };

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="purple" position="fixed" bottom="20px" right="20px">Registrar</Button>
      <Button onClick={handleLogout} colorScheme="red" position="fixed" bottom="20px" left="20px">Sair</Button>
      
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
            <Button colorScheme="purple">Registrar</Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default RegisterPointPage;