import { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const RegisterPointPage = () => {
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
      <Button onClick={handleLogout} colorScheme="red" position="fixed" bottom="20px" left="20px">Sair</Button>
      {}
    </Box>
  );
};

export default RegisterPointPage;