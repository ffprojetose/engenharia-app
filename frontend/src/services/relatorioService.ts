import api from './api';

export interface RelatorioGeral {
  periodo: {
    inicio: string;
    fim: string;
  };
  projetos: {
    total: number;
    porStatus: Array<{
      status: string;
      quantidade: number;
      percentual: number;
    }>;
    atrasados: number;
  };
  tarefas: {
    total: number;
    porPrioridade: Array<{
      prioridade: string;
      quantidade: number;
      percentual: number;
    }>;
    porStatus: Array<{
      status: string;
      quantidade: number;
      percentual: number;
    }>;
    atrasadas: number;
  };
  clientes: {
    total: number;
    novos: number;
    ativos: number;
    inativos: number;
  };
  fornecedores: {
    total: number;
    avaliacaoMedia: number;
    porCategoria: Array<{
      categoria: string;
      quantidade: number;
    }>;
  };
  financeiro: {
    receitaTotal: number;
    despesaTotal: number;
    saldo: number;
    inadimplencia: number;
    projecaoProximoMes: {
      receitas: number;
      despesas: number;
    };
  };
}

export interface RelatorioDesempenho {
  periodo: {
    inicio: string;
    fim: string;
  };
  indicadores: Array<{
    nome: string;
    valor: number;
    meta: number;
    unidade: string;
    variacao: number;
    status: 'acima' | 'dentro' | 'abaixo';
  }>;
  graficos: Array<{
    tipo: string;
    titulo: string;
    dados: any;
    configuracoes: any;
  }>;
}

export const relatorioService = {
  gerarRelatorioGeral: async (params: {
    dataInicio: string;
    dataFim: string;
  }) => {
    const response = await api.get<RelatorioGeral>('/relatorios/geral', { params });
    return response.data;
  },

  gerarRelatorioDesempenho: async (params: {
    dataInicio: string;
    dataFim: string;
    indicadores?: string[];
  }) => {
    const response = await api.get<RelatorioDesempenho>('/relatorios/desempenho', { params });
    return response.data;
  },

  exportarRelatorio: async (tipo: string, params: {
    dataInicio: string;
    dataFim: string;
    formato: 'pdf' | 'excel' | 'csv';
  }) => {
    const response = await api.get(`/relatorios/${tipo}/exportar`, {
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  agendarRelatorio: async (dados: {
    tipo: string;
    periodicidade: 'diario' | 'semanal' | 'mensal';
    destinatarios: string[];
    formato: 'pdf' | 'excel' | 'csv';
    configuracoes: any;
  }) => {
    const response = await api.post('/relatorios/agendar', dados);
    return response.data;
  },
}; 