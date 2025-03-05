import api from './api';

export interface Fornecedor {
  id: string;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual?: string;
  email: string;
  telefone: string;
  endereco: {
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
  contatos: Array<{
    nome: string;
    cargo: string;
    email: string;
    telefone: string;
  }>;
  categorias: string[];
  status: 'ativo' | 'inativo';
  avaliacoes: Array<{
    data: string;
    nota: number;
    comentario?: string;
    projeto?: string;
  }>;
}

export const fornecedorService = {
  listar: async () => {
    const response = await api.get<Fornecedor[]>('/fornecedores');
    return response.data;
  },

  criar: async (fornecedor: Omit<Fornecedor, 'id'>) => {
    const response = await api.post<Fornecedor>('/fornecedores', fornecedor);
    return response.data;
  },

  atualizar: async (id: string, fornecedor: Partial<Fornecedor>) => {
    const response = await api.put<Fornecedor>(`/fornecedores/${id}`, fornecedor);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/fornecedores/${id}`);
  },

  avaliar: async (id: string, avaliacao: Fornecedor['avaliacoes'][0]) => {
    const response = await api.post<Fornecedor>(`/fornecedores/${id}/avaliacoes`, avaliacao);
    return response.data;
  },
}; 