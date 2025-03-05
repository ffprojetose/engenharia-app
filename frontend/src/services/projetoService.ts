import api from './api';
import { Projeto, CriarProjetoDTO, Fase } from '../types/Projeto';

const validarProjeto = (projeto: CriarProjetoDTO) => {
  const erros: string[] = [];

  if (!projeto.nome?.trim()) {
    erros.push('Nome do projeto é obrigatório');
  }

  if (!projeto.cliente_id) {
    erros.push('Cliente é obrigatório');
  }

  if (!projeto.responsavel_id) {
    erros.push('Responsável é obrigatório');
  }

  if (!projeto.data_inicio) {
    erros.push('Data de início é obrigatória');
  }

  if (!projeto.data_previsao_fim) {
    erros.push('Data de previsão de fim é obrigatória');
  }

  if (!projeto.fases?.length) {
    erros.push('Pelo menos uma fase é obrigatória');
  }

  if (!projeto.orcamento?.valorPrevisto) {
    erros.push('Orçamento previsto é obrigatório');
  }

  return erros;
};

export const buscarProjetos = async (): Promise<Projeto[]> => {
  try {
    const response = await api.get('/projetos');
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar projetos:', error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar projetos');
  }
};

export const criarProjeto = async (projeto: CriarProjetoDTO): Promise<Projeto> => {
  try {
    // Validar projeto antes de enviar
    const erros = validarProjeto(projeto);
    if (erros.length > 0) {
      throw new Error(`Erros de validação:\n${erros.join('\n')}`);
    }

    // Garantir que as fases estejam no formato correto
    const fasesFormatadas: Fase[] = projeto.fases.map(fase => ({
      nome: fase.nome,
      duracao: Number(fase.duracao),
      status: 'pendente'
    }));

    // Formatar datas
    const projetoFormatado = {
      ...projeto,
      fases: fasesFormatadas,
      data_inicio: new Date(projeto.data_inicio).toISOString(),
      data_previsao_fim: new Date(projeto.data_previsao_fim).toISOString(),
      orcamento: {
        valorPrevisto: Number(projeto.orcamento.valorPrevisto),
        valorGasto: 0
      }
    };

    const response = await api.post('/projetos', projetoFormatado);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar projeto:', error);
    throw new Error(error.response?.data?.message || error.message || 'Erro ao criar projeto');
  }
};

export const atualizarProjeto = async (id: number, projeto: Partial<CriarProjetoDTO>): Promise<Projeto> => {
  try {
    // Se estiver atualizando fases, garantir o formato correto
    if (projeto.fases) {
      projeto.fases = projeto.fases.map(fase => ({
        nome: fase.nome,
        duracao: Number(fase.duracao),
        status: fase.status
      }));
    }

    // Se estiver atualizando datas, formatar
    if (projeto.data_inicio) {
      projeto.data_inicio = new Date(projeto.data_inicio).toISOString();
    }
    if (projeto.data_previsao_fim) {
      projeto.data_previsao_fim = new Date(projeto.data_previsao_fim).toISOString();
    }

    const response = await api.put(`/projetos/${id}`, projeto);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao atualizar projeto ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao atualizar projeto');
  }
};

export const deletarProjeto = async (id: number): Promise<void> => {
  try {
    await api.delete(`/projetos/${id}`);
  } catch (error: any) {
    console.error(`Erro ao deletar projeto ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao deletar projeto');
  }
};

export const buscarProjetoPorId = async (id: number): Promise<Projeto> => {
  try {
    const response = await api.get(`/projetos/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Erro ao buscar projeto ${id}:`, error);
    throw new Error(error.response?.data?.message || 'Erro ao buscar projeto');
  }
}; 