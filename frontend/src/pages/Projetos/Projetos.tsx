import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Grid,
  Alert,
  SelectChangeEvent,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Cliente } from '../../types/Cliente';
import { Usuario } from '../../types/Usuario';
import { Projeto, CriarProjetoDTO, Fase, Orcamento } from '../../types/Projeto';
import { buscarClientes } from '../../services/clienteService';
import { buscarUsuarios } from '../../services/usuarioService';
import { buscarProjetos, criarProjeto, atualizarProjeto, deletarProjeto } from '../../services/projetoService';
import { formatarMoeda } from '../../utils/formatters';

interface FormData extends Omit<CriarProjetoDTO, 'cliente_id' | 'responsavel_id'> {
  cliente_id: string;
  responsavel_id: string;
}

const initialFormData: FormData = {
  nome: '',
  descricao: '',
  cliente_id: '',
  responsavel_id: '',
  data_inicio: '',
  data_previsao_fim: '',
  status: 'em_planejamento',
  orcamento: {
    valorPrevisto: 0,
    valorGasto: 0
  },
  fases: [
    {
      nome: 'Estudo Preliminar',
      duracao: 15,
      status: 'pendente'
    },
    {
      nome: 'Anteprojeto',
      duracao: 15,
      status: 'pendente'
    },
    {
      nome: 'Projeto Executivo',
      duracao: 18,
      status: 'pendente'
    }
  ],
  documentos: [],
  observacoes: ''
};

function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingProjeto, setEditingProjeto] = useState<Projeto | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [sucesso, setSucesso] = useState<string | null>(null);

  const carregarProjetos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarProjetos();
      setProjetos(data);
    } catch (error: any) {
      console.error('Erro ao carregar projetos:', error);
      setError(error.message || 'Erro ao carregar projetos');
    } finally {
      setLoading(false);
    }
  };

  const carregarClientes = async () => {
    try {
      const data = await buscarClientes();
      setClientes(data);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setError(error.message || 'Erro ao carregar clientes');
    }
  };

  const carregarUsuarios = async () => {
    try {
      const data = await buscarUsuarios();
      setUsuarios(data);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      setError(error.message || 'Erro ao carregar usuários');
    }
  };

  useEffect(() => {
    carregarProjetos();
    carregarClientes();
    carregarUsuarios();
  }, []);

  // Efeito para criar um projeto modelo
  useEffect(() => {
    const criarProjetoModelo = async () => {
      try {
        setLoading(true);
        setError(null);

        const projetoModelo: CriarProjetoDTO = {
          nome: 'Projeto Modelo',
          descricao: 'Este é um projeto modelo criado automaticamente',
          cliente_id: Number(formData.cliente_id),
          responsavel_id: Number(formData.responsavel_id),
          data_inicio: new Date().toISOString().split('T')[0],
          data_previsao_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'em_planejamento',
          orcamento: {
            valorPrevisto: 0,
            valorGasto: 0
          },
          fases: [
            {
              nome: 'Estudo Preliminar',
              duracao: 15,
              status: 'pendente'
            },
            {
              nome: 'Anteprojeto',
              duracao: 15,
              status: 'pendente'
            },
            {
              nome: 'Projeto Executivo',
              duracao: 18,
              status: 'pendente'
            }
          ],
          documentos: [],
          observacoes: ''
        };

        await criarProjeto(projetoModelo);
        await carregarProjetos();
      } catch (error: any) {
        console.error('Erro ao criar projeto modelo:', error);
        setError(error.response?.data?.message || 'Erro ao criar projeto modelo');
      } finally {
        setLoading(false);
      }
    };

    if (projetos.length === 0) {
      criarProjetoModelo();
    }
  }, [projetos.length]);

  const handleOpenDialog = (projeto?: Projeto) => {
    if (projeto) {
      setEditingProjeto(projeto);
      setFormData({
        nome: projeto.nome,
        descricao: projeto.descricao || '',
        cliente_id: projeto.cliente_id.toString(),
        responsavel_id: projeto.responsavel_id.toString(),
        data_inicio: projeto.data_inicio.split('T')[0],
        data_previsao_fim: projeto.data_previsao_fim.split('T')[0],
        data_fim_real: projeto.data_fim_real ? projeto.data_fim_real.split('T')[0] : undefined,
        status: projeto.status,
        orcamento: projeto.orcamento || { valorPrevisto: 0, valorGasto: 0 },
        fases: Array.isArray(projeto.fases) ? projeto.fases : [],
        documentos: projeto.documentos || [],
        observacoes: projeto.observacoes
      });
    } else {
      setEditingProjeto(null);
      setFormData({
        ...initialFormData,
        data_inicio: new Date().toISOString().split('T')[0],
        data_previsao_fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fases: [
          {
            nome: 'Estudo Preliminar',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Anteprojeto',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Projeto Executivo',
            duracao: 18,
            status: 'pendente'
          }
        ]
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProjeto(null);
    setError(null);
  };

  const handleEditProjeto = (projeto: Projeto) => {
    setEditingProjeto(projeto);
    setFormData({
      nome: projeto.nome,
      descricao: projeto.descricao || '',
      cliente_id: projeto.cliente_id.toString(),
      responsavel_id: projeto.responsavel_id.toString(),
      data_inicio: projeto.data_inicio,
      data_previsao_fim: projeto.data_previsao_fim,
      data_fim_real: projeto.data_fim_real,
      status: projeto.status,
      orcamento: projeto.orcamento,
      fases: projeto.fases,
      documentos: projeto.documentos,
      observacoes: projeto.observacoes
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projetoData: CriarProjetoDTO = {
        ...formData,
        cliente_id: Number(formData.cliente_id),
        responsavel_id: Number(formData.responsavel_id),
        data_inicio: formData.data_inicio.split('T')[0],
        data_previsao_fim: formData.data_previsao_fim.split('T')[0],
        data_fim_real: formData.data_fim_real ? formData.data_fim_real.split('T')[0] : undefined,
        status: formData.status || 'em_planejamento',
        orcamento: {
          valorPrevisto: Number(formData.orcamento.valorPrevisto),
          valorGasto: Number(formData.orcamento.valorGasto)
        },
        fases: formData.fases || [
          {
            nome: 'Estudo Preliminar',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Anteprojeto',
            duracao: 15,
            status: 'pendente'
          },
          {
            nome: 'Projeto Executivo',
            duracao: 18,
            status: 'pendente'
          }
        ],
        documentos: formData.documentos || [],
        observacoes: formData.observacoes
      };

      if (editingProjeto) {
        await atualizarProjeto(editingProjeto.id, projetoData);
        setSucesso('Projeto atualizado com sucesso!');
      } else {
        await criarProjeto(projetoData);
        setSucesso('Projeto criado com sucesso!');
      }

      handleCloseDialog();
      await carregarProjetos();
    } catch (error: any) {
      console.error('Erro ao salvar projeto:', error);
      setError(error.message || 'Erro ao salvar projeto');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este projeto?')) {
      try {
        setLoading(true);
        setError(null);
        await deletarProjeto(id);
        setSucesso('Projeto excluído com sucesso!');
        await carregarProjetos();
      } catch (error: any) {
        console.error('Erro ao excluir projeto:', error);
        setError(error.response?.data?.message || 'Erro ao excluir projeto');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: Projeto['status']) => {
    const colors: Record<Projeto['status'], 'info' | 'warning' | 'default' | 'success' | 'error'> = {
      em_planejamento: 'info',
      em_andamento: 'warning',
      pausado: 'default',
      concluido: 'success',
      cancelado: 'error',
    };
    return colors[status];
  };

  const formatarStatus = (status: Projeto['status']) => {
    const formatacao: Record<Projeto['status'], string> = {
      em_planejamento: 'Em Planejamento',
      em_andamento: 'Em Andamento',
      pausado: 'Pausado',
      concluido: 'Concluído',
      cancelado: 'Cancelado',
    };
    return formatacao[status];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    if (name.startsWith('orcamento.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        orcamento: {
          ...prev.orcamento,
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestão de Projetos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Novo Projeto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Responsável</TableCell>
              <TableCell>Data Início</TableCell>
              <TableCell>Previsão Fim</TableCell>
              <TableCell>Fases</TableCell>
              <TableCell>Orçamento Previsto</TableCell>
              <TableCell>Valor Gasto</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projetos?.map((projeto) => (
              <TableRow key={projeto.id}>
                <TableCell>{projeto.nome}</TableCell>
                <TableCell>
                  {clientes?.find(c => Number(c.id) === Number(projeto.cliente_id))?.nome || 'Cliente não encontrado'}
                </TableCell>
                <TableCell>
                  {usuarios?.find(u => Number(u.id) === Number(projeto.responsavel_id))?.nome || 'Usuário não encontrado'}
                </TableCell>
                <TableCell>{new Date(projeto.data_inicio).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(projeto.data_previsao_fim).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box>
                    {projeto.fases?.map((fase, index) => (
                      <Chip
                        key={index}
                        label={`${fase.nome}: ${fase.status}`}
                        color={
                          fase.status === 'concluida'
                            ? 'success'
                            : fase.status === 'em_andamento'
                            ? 'primary'
                            : 'default'
                        }
                        sx={{ m: 0.5 }}
                      />
                    )) || []}
                  </Box>
                </TableCell>
                <TableCell>
                  {formatarMoeda(projeto.orcamento.valorPrevisto)}
                </TableCell>
                <TableCell>
                  {formatarMoeda(projeto.orcamento.valorGasto)}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEditProjeto(projeto)}
                    color="primary"
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(projeto.id)}
                    color="error"
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProjeto ? 'Editar Projeto' : 'Novo Projeto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Nome do Projeto"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Cliente</InputLabel>
                <Select
                  name="cliente_id"
                  value={formData.cliente_id}
                  onChange={(e: SelectChangeEvent<string>) => handleChange(e)}
                  label="Cliente"
                >
                  {clientes?.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nome} ({cliente.tipo === 'pessoa_fisica' ? 'PF' : 'PJ'})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Responsável</InputLabel>
                <Select
                  name="responsavel_id"
                  value={formData.responsavel_id}
                  onChange={(e: SelectChangeEvent<string>) => handleChange(e)}
                  label="Responsável"
                >
                  {usuarios?.map((usuario) => (
                    <MenuItem key={usuario.id} value={usuario.id.toString()}>
                      {usuario.nome} ({usuario.cargo})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data de Início"
                name="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Previsão de Término"
                name="data_previsao_fim"
                type="date"
                value={formData.data_previsao_fim}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Orçamento Previsto"
                name="orcamento.valorPrevisto"
                type="number"
                value={formData.orcamento.valorPrevisto}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Valor Gasto"
                name="orcamento.valorGasto"
                type="number"
                value={formData.orcamento.valorGasto}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Fases do Projeto
              </Typography>
              {formData.fases?.map((fase, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Nome da Fase"
                        value={fase.nome}
                        onChange={(e) => {
                          const novasFases = [...formData.fases];
                          novasFases[index] = { ...fase, nome: e.target.value };
                          setFormData({ ...formData, fases: novasFases });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Duração (dias)"
                        value={fase.duracao}
                        onChange={(e) => {
                          const novasFases = [...formData.fases];
                          novasFases[index] = { ...fase, duracao: Number(e.target.value) };
                          setFormData({ ...formData, fases: novasFases });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={fase.status}
                          onChange={(e) => {
                            const novasFases = [...formData.fases];
                            novasFases[index] = { ...fase, status: e.target.value as Fase['status'] };
                            setFormData({ ...formData, fases: novasFases });
                          }}
                          label="Status"
                        >
                          <MenuItem value="pendente">Pendente</MenuItem>
                          <MenuItem value="em_andamento">Em Andamento</MenuItem>
                          <MenuItem value="concluida">Concluída</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                      <IconButton
                        color="error"
                        onClick={() => {
                          const novasFases = formData.fases.filter((_, i) => i !== index);
                          setFormData({ ...formData, fases: novasFases });
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  const novasFases = Array.isArray(formData.fases) ? [...formData.fases] : [];
                  setFormData({
                    ...formData,
                    fases: [
                      ...novasFases,
                      { nome: '', duracao: 0, status: 'pendente' }
                    ]
                  });
                }}
              >
                Adicionar Fase
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={formData.observacoes}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Projetos; 