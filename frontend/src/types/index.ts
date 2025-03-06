export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'membro';
  ativo: boolean;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}

export interface ApiError {
  erro: string;
} 