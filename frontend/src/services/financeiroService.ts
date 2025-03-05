import api from './api';

export interface Transacao {
  id: string;
  tipo: 'receita' | 'despesa';
  categoria: string;
  descricao: string;
  valor: number;
  data: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  formaPagamento?: string;
  projeto?: string;
  cliente?: string;
  fornecedor?: string;
  comprovante?: string;
  parcelas?: Array<{
    numero: number;
    valor: number;
    dataVencimento: string;
    dataPagamento?: string;
    status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  }>;
  observacoes?: string;
}

export interface RelatorioFinanceiro {
  periodo: {
    inicio: string;
    fim: string;
  };
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  transacoesPorCategoria: Array<{
    categoria: string;
    total: number;
    quantidade: number;
  }>;
  transacoesPorStatus: Array<{
    status: string;
    total: number;
    quantidade: number;
  }>;
}

export const financeiroService = {
  listarTransacoes: async (filtros?: {
    tipo?: 'receita' | 'despesa';
    status?: string;
    dataInicio?: string;
    dataFim?: string;
    categoria?: string;
  }) => {
    const response = await api.get<Transacao[]>('/financeiro/transacoes', { params: filtros });
    return response.data;
  },

  criarTransacao: async (transacao: Omit<Transacao, 'id'>) => {
    const response = await api.post<Transacao>('/financeiro/transacoes', transacao);
    return response.data;
  },

  atualizarTransacao: async (id: string, transacao: Partial<Transacao>) => {
    const response = await api.put<Transacao>(`/financeiro/transacoes/${id}`, transacao);
    return response.data;
  },

  excluirTransacao: async (id: string) => {
    await api.delete(`/financeiro/transacoes/${id}`);
  },

  gerarRelatorio: async (params: {
    dataInicio: string;
    dataFim: string;
    tipo?: 'receita' | 'despesa';
    categoria?: string;
  }) => {
    const response = await api.get<RelatorioFinanceiro>('/financeiro/relatorios', { params });
    return response.data;
  },

  registrarPagamento: async (id: string, dados: {
    dataPagamento: string;
    formaPagamento: string;
    comprovante?: string;
  }) => {
    const response = await api.post<Transacao>(`/financeiro/transacoes/${id}/pagamento`, dados);
    return response.data;
  },
}; 