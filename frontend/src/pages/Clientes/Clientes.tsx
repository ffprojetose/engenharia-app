import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { buscarClientes, buscarClientePorId, criarCliente, atualizarCliente, excluirCliente, buscarCep } from '../../services/clienteService';
import { Cliente, CriarClienteDTO, Endereco } from '../../types/Cliente';
import { SelectChangeEvent } from '@mui/material/Select';

interface FormData {
  id?: number;
  nome: string;
  tipo: 'pessoa_fisica' | 'pessoa_juridica';
  documento: string;
  email: string;
  telefone: string;
  ativo: boolean;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const initialFormData: FormData = {
    nome: '',
    tipo: 'pessoa_fisica' as const,
    documento: '',
    email: '',
    telefone: '',
    ativo: true,
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    }
  };
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarClientes();
      setClientes(data);
    } catch (error: any) {
      console.error('Erro ao carregar clientes:', error);
      setError(error.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  const handleOpenDialog = () => {
    setFormData(initialFormData);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<'pessoa_fisica' | 'pessoa_juridica'>
  ) => {
    const { name, value } = e.target;

    if (name === 'ativo') {
      setFormData(prev => ({
        ...prev,
        ativo: (e.target as HTMLInputElement).checked
      }));
      return;
    }

    if (name.startsWith('endereco.')) {
      const enderecoField = name.split('.')[1] as keyof Endereco;
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [enderecoField]: value
        }
      }));

      if (enderecoField === 'cep' && value.replace(/\D/g, '').length === 8) {
        buscarEnderecoPorCep(value);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const buscarEnderecoPorCep = async (cep: string) => {
    setBuscandoCep(true);
    try {
      const endereco = await buscarCep(cep);
      if (endereco) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...endereco,
            numero: prev.endereco?.numero || '',
            complemento: prev.endereco?.complemento || ''
          }
        }));
      } else {
        setError('CEP não encontrado');
      }
    } catch (err) {
      setError('Erro ao buscar CEP');
      console.error(err);
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (formData.id) {
        await atualizarCliente(formData.id, formData);
      } else {
        const novoCliente: CriarClienteDTO = {
          nome: formData.nome,
          tipo: formData.tipo,
          documento: formData.documento,
          email: formData.email,
          telefone: formData.telefone,
          ativo: formData.ativo,
          endereco: formData.endereco
        };
        await criarCliente(novoCliente);
      }
      handleCloseDialog();
      await carregarClientes();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      setError(error.message || 'Erro ao salvar cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setFormData({
      id: cliente.id,
      nome: cliente.nome,
      tipo: cliente.tipo,
      documento: cliente.documento,
      email: cliente.email,
      telefone: cliente.telefone,
      ativo: cliente.ativo ?? true,
      endereco: cliente.endereco,
      createdAt: cliente.createdAt,
      updatedAt: cliente.updatedAt
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await excluirCliente(id);
      await carregarClientes();
    } catch (error: any) {
      console.error('Erro ao excluir cliente:', error);
      setError(error.message || 'Erro ao excluir cliente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestão de Clientes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={loading}
        >
          Novo Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Documento</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            ) : clientes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  Nenhum cliente cadastrado
                </TableCell>
              </TableRow>
            ) : (
              clientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nome}</TableCell>
                  <TableCell>
                    {cliente.tipo === 'pessoa_fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </TableCell>
                  <TableCell>{cliente.documento}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>
                    <Switch
                      checked={cliente.ativo}
                      onChange={async (e) => {
                        try {
                          await atualizarCliente(cliente.id, { ativo: e.target.checked });
                          await carregarClientes();
                        } catch (error) {
                          setError('Erro ao atualizar status do cliente');
                        }
                      }}
                      color="primary"
                    />
                    {cliente.ativo ? 'Ativo' : 'Inativo'}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(cliente)}
                      disabled={loading}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(cliente.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {formData.id ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                required
                error={!formData.nome}
                helperText={!formData.nome ? 'Campo obrigatório' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!formData.tipo}>
                <InputLabel id="tipo-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-label"
                  label="Tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                >
                  <MenuItem value="pessoa_fisica">Pessoa Física</MenuItem>
                  <MenuItem value="pessoa_juridica">Pessoa Jurídica</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={formData.tipo === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
                name="documento"
                value={formData.documento}
                onChange={handleInputChange}
                required
                error={!formData.documento}
                helperText={!formData.documento ? 'Campo obrigatório' : ''}
                placeholder={formData.tipo === 'pessoa_fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                error={!formData.email}
                helperText={!formData.email ? 'Campo obrigatório' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                required
                error={!formData.telefone}
                helperText={!formData.telefone ? 'Campo obrigatório' : ''}
                placeholder="(00) 00000-0000"
              />
            </Grid>

            {/* Campos de Endereço */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                Endereço
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                name="endereco.cep"
                value={formData.endereco.cep}
                onChange={handleInputChange}
                required
                error={!formData.endereco.cep}
                helperText={!formData.endereco.cep ? 'Campo obrigatório' : ''}
                disabled={buscandoCep}
                placeholder="00000-000"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Logradouro"
                name="endereco.logradouro"
                value={formData.endereco.logradouro}
                onChange={handleInputChange}
                required
                error={!formData.endereco.logradouro}
                helperText={!formData.endereco.logradouro ? 'Campo obrigatório' : ''}
                disabled={buscandoCep}
              />
            </Grid>

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Número"
                name="endereco.numero"
                value={formData.endereco.numero}
                onChange={handleInputChange}
                required
                error={!formData.endereco.numero}
                helperText={!formData.endereco.numero ? 'Campo obrigatório' : ''}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Complemento"
                name="endereco.complemento"
                value={formData.endereco.complemento}
                onChange={handleInputChange}
                disabled={buscandoCep}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bairro"
                name="endereco.bairro"
                value={formData.endereco.bairro}
                onChange={handleInputChange}
                required
                error={!formData.endereco.bairro}
                helperText={!formData.endereco.bairro ? 'Campo obrigatório' : ''}
                disabled={buscandoCep}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Cidade"
                name="endereco.cidade"
                value={formData.endereco.cidade}
                onChange={handleInputChange}
                required
                error={!formData.endereco.cidade}
                helperText={!formData.endereco.cidade ? 'Campo obrigatório' : ''}
                disabled={buscandoCep}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Estado"
                name="endereco.estado"
                value={formData.endereco.estado}
                onChange={handleInputChange}
                required
                error={!formData.endereco.estado}
                helperText={!formData.endereco.estado ? 'Campo obrigatório' : ''}
                disabled={buscandoCep}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.ativo}
                      onChange={handleInputChange}
                      name="ativo"
                      color="primary"
                    />
                  }
                  label={formData.ativo ? 'Ativo' : 'Inativo'}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
          >
            {loading ? 'Salvando...' : formData.id ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setError(null)} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 