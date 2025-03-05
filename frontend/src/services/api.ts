import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000, // timeout de 10 segundos
  headers: {
    'Content-Type': 'application/json'
  }
});

// Adiciona o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    try {
      const token = authService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Erro ao configurar cabeçalho de autenticação:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      // Erro de rede ou servidor não disponível
      console.error('Erro de conexão:', error);
      throw new Error('Erro de conexão com o servidor. Por favor, verifique sua conexão.');
    }

    if (error.response.status === 401) {
      // Token expirado ou inválido
      authService.logout();
      window.location.href = '/login';
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    if (error.response.status === 404) {
      console.error('Recurso não encontrado:', error);
      throw new Error('Recurso não encontrado no servidor.');
    }

    return Promise.reject(error);
  }
);

export default api; 