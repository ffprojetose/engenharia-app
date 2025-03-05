export interface Fase {
  nome: string;
  duracao: number;
  status: 'pendente' | 'em_andamento' | 'concluida';
}

export interface Orcamento {
  valorPrevisto: number;
  valorGasto: number;
}

export interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  cliente_id: number;
  responsavel_id: number;
  data_inicio: string;
  data_previsao_fim: string;
  data_fim_real?: string;
  status: 'em_planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado';
  fases: Fase[];
  orcamento: Orcamento;
  documentos: string[];
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CriarProjetoDTO = Omit<Projeto, 'id' | 'createdAt' | 'updatedAt'>; 