import api from './api';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: 'admin' | 'financeiro' | 'membro';
  cargo: string;
  telefone: string;
  ativo: boolean;
  ultimoAcesso?: Date;
}

interface LoginResponse {
  usuario: Usuario;
  token: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const authService = {
  login: async (email: string, senha: string): Promise<LoginResponse> => {
    try {
      const response = await api.post<LoginResponse>('/usuarios/login', { email, senha });
      
      // Salvar o token e usuário no localStorage com tratamento de erro
      try {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.usuario));
      } catch (error) {
        console.error('Erro ao salvar dados no localStorage:', error);
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  },

  logout: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Erro ao remover dados do localStorage:', error);
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao ler token do localStorage:', error);
      return null;
    }
  },

  getUsuario: (): Usuario | null => {
    try {
      const usuario = localStorage.getItem(USER_KEY);
      return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
      console.error('Erro ao ler usuário do localStorage:', error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return false;

      // Verifica se o token está no formato JWT
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      // Decodifica o payload do token
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Verifica se o token expirou
      const expirationTime = payload.exp * 1000; // Converte para milissegundos
      if (Date.now() >= expirationTime) {
        authService.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      return false;
    }
  }
}; 