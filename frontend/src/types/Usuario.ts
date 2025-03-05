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