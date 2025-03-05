import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Box, CircularProgress } from '@mui/material';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = authService.isAuthenticated();
        setIsAuth(auth);
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuth(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Verifica a autenticação imediatamente
    checkAuth();

    // Configura um intervalo para verificar a autenticação periodicamente
    const interval = setInterval(checkAuth, 60000); // Verifica a cada minuto

    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, []);

  if (isChecking) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: 'background.default' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuth) {
    // Redireciona para o login com o estado da localização atual
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Renderiza o conteúdo protegido
  return <>{children}</>;
}; 