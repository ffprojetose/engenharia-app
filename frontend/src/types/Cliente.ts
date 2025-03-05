export interface Endereco {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  numero: string;
}

export interface Cliente {
  id: number;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  documento: string;
  email: string;
  telefone: string;
  endereco: Endereco;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CriarClienteDTO = Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>; 