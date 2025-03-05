import api from './api';
import { Cliente, Endereco, CriarClienteDTO } from '../types/Cliente';

export type CamposCliente = keyof Omit<Cliente, 'id'>;

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const buscarClientes = async (): Promise<Cliente[]> => {
  const response = await api.get('/clientes');
  return response.data;
};

export const buscarClientePorId = async (id: number): Promise<Cliente> => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const criarCliente = async (cliente: CriarClienteDTO): Promise<Cliente> => {
  const response = await api.post('/clientes', cliente);
  return response.data;
};

export const atualizarCliente = async (id: number, cliente: Partial<Cliente>): Promise<Cliente> => {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const excluirCliente = async (id: number): Promise<void> => {
  await api.delete(`/clientes/${id}`);
};

export const buscarCep = async (cep: string): Promise<Endereco | null> => {
  try {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return null;

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data: ViaCEPResponse = await response.json();

    if (data.erro) return null;

    return {
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      numero: ''
    };
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    return null;
  }
}; 