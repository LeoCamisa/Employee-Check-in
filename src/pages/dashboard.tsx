import { useState, useEffect } from 'react';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import { useRouter } from 'next/router';

const Dashboard = () => {
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
      </Flex>
      {}
    </Box>
  );
};

export default Dashboard;