import api from './api';

export interface Reuniao {
  id: string;
  titulo: string;
  tipo: 'interna' | 'cliente' | 'fornecedor';
  projeto?: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  local: {
    tipo: 'presencial' | 'online';
    endereco?: string;
    linkReuniao?: string;
  };
  organizador: string;
  participantes: Array<{
    usuario: string;
    confirmado: boolean;
    presenca: boolean;
  }>;
  status: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
}

export const reuniaoService = {
  listar: async () => {
    const response = await api.get<Reuniao[]>('/reunioes');
    return response.data;
  },

  criar: async (reuniao: Omit<Reuniao, 'id'>) => {
    const response = await api.post<Reuniao>('/reunioes', reuniao);
    return response.data;
  },

  atualizar: async (id: string, reuniao: Partial<Reuniao>) => {
    const response = await api.put<Reuniao>(`/reunioes/${id}`, reuniao);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/reunioes/${id}`);
  },

  confirmarPresenca: async (id: string) => {
    const response = await api.post<Reuniao>(`/reunioes/${id}/confirmar-presenca`);
    return response.data;
  },
}; 