import api from './api';
import { authService } from './authService';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'financeiro' | 'membro';
  cargo: string;
  telefone: string;
  ativo: boolean;
  ultimo_acesso?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  tipo: 'admin' | 'financeiro' | 'membro';
  cargo: string;
  telefone: string;
}

export interface AtualizarUsuarioDTO {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: 'admin' | 'financeiro' | 'membro';
  cargo?: string;
  telefone?: string;
  ativo?: boolean;
}

export const buscarUsuarios = async (): Promise<Usuario[]> => {
  try {
    const response = await api.get('/usuarios');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar usuários');
  }
};

export const buscarUsuarioPorId = async (id: number): Promise<Usuario> => {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar usuário');
  }
};

export const criarUsuario = async (usuario: CriarUsuarioDTO): Promise<Usuario> => {
  try {
    const response = await api.post('/usuarios', usuario);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    throw new Error(error.response?.data?.message || 'Erro ao criar usuário');
  }
};

export const atualizarUsuario = async (id: number, usuario: AtualizarUsuarioDTO): Promise<Usuario> => {
  try {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar usuário ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao atualizar usuário');
  }
};

export const excluirUsuario = async (id: number): Promise<void> => {
  try {
    await api.delete(`/usuarios/${id}`);
  } catch (error: any) {
    console.error(`Erro ao excluir usuário ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao excluir usuário');
  }
};

export const desativarUsuario = async (id: number): Promise<void> => {
  if (!authService.isAuthenticated()) {
    throw new Error('Usuário não autenticado');
  }

  try {
    await api.patch(`/usuarios/${id}/desativar`);
  } catch (error: any) {
    console.error(`Erro ao desativar usuário ${id}:`, error);
    if (error.response?.status === 401) {
      authService.logout();
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }
    throw new Error(error.response?.data?.message || 'Erro ao desativar usuário');
  }
};

export const atualizarPermissoes = async (id: number, permissoes: string[]): Promise<Usuario> => {
  try {
    const response = await api.patch(`/usuarios/${id}/permissoes`, { permissoes });
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar permissões do usuário ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao atualizar permissões');
  }
}; 