import api from './api';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  projeto: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada';
  dataInicio: string;
  dataPrevisaoFim: string;
  horasEstimadas: number;
  horasGastas: number;
}

export const tarefaService = {
  listar: async () => {
    const response = await api.get<Tarefa[]>('/tarefas');
    return response.data;
  },

  criar: async (tarefa: Omit<Tarefa, 'id'>) => {
    const response = await api.post<Tarefa>('/tarefas', tarefa);
    return response.data;
  },

  atualizar: async (id: string, tarefa: Partial<Tarefa>) => {
    const response = await api.put<Tarefa>(`/tarefas/${id}`, tarefa);
    return response.data;
  },

  excluir: async (id: string) => {
    await api.delete(`/tarefas/${id}`);
  },
}; 