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
  SelectChangeEvent,
  Alert,
  Switch,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Usuario, CriarUsuarioDTO, AtualizarUsuarioDTO, buscarUsuarios, buscarUsuarioPorId, criarUsuario, atualizarUsuario, excluirUsuario, desativarUsuario } from '../../services/usuarioService';
import { authService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<CriarUsuarioDTO>({
    nome: '',
    email: '',
    senha: '',
    tipo: 'membro',
    cargo: '',
    telefone: '',
  });
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await buscarUsuarios();
      setUsuarios(data);
    } catch (error: any) {
      console.error('Erro ao carregar usuários:', error);
      const mensagemErro = error.response?.data?.message || 
                          error.message || 
                          'Erro ao carregar usuários. Por favor, tente novamente.';
      setError(mensagemErro);
      
      if (error.response?.status === 401) {
        // Redireciona para o login se o token estiver inválido
        authService.logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      setEditingUser(usuario);
      setFormData({
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        tipo: usuario.tipo,
        cargo: usuario.cargo,
        telefone: usuario.telefone,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nome: '',
        email: '',
        senha: '',
        tipo: 'membro',
        cargo: '',
        telefone: '',
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<'admin' | 'financeiro' | 'membro'>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      if (editingUser) {
        const dadosAtualizacao: AtualizarUsuarioDTO = {
          nome: formData.nome,
          email: formData.email,
          ...(formData.senha && { senha: formData.senha }),
          tipo: formData.tipo,
          cargo: formData.cargo,
          telefone: formData.telefone,
        };
        await atualizarUsuario(editingUser.id, dadosAtualizacao);
      } else {
        await criarUsuario(formData);
      }
      handleCloseDialog();
      await carregarUsuarios();
    } catch (error: any) {
      console.error('Erro ao salvar usuário:', error);
      setError(error.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await excluirUsuario(id);
      await carregarUsuarios();
    } catch (error: any) {
      console.error('Erro ao excluir usuário:', error);
      setError(error.message || 'Erro ao excluir usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (usuario: Usuario) => {
    try {
      setLoading(true);
      setError(null);
      await atualizarUsuario(usuario.id, { ativo: !usuario.ativo });
      await carregarUsuarios();
    } catch (error: any) {
      console.error('Erro ao atualizar status do usuário:', error);
      setError(error.message || 'Erro ao atualizar status do usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Gestão de Usuários</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          disabled={loading}
        >
          Novo Usuário
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Typography>Carregando...</Typography>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Cargo</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id}>
                <TableCell>{usuario.nome}</TableCell>
                <TableCell>{usuario.email}</TableCell>
                <TableCell>
                  <Chip
                    label={usuario.tipo.toUpperCase()}
                    color={
                      usuario.tipo === 'admin'
                        ? 'error'
                        : usuario.tipo === 'financeiro'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </TableCell>
                <TableCell>{usuario.cargo}</TableCell>
                <TableCell>{usuario.telefone}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={usuario.ativo}
                        onChange={() => handleToggleAtivo(usuario)}
                        color="primary"
                        disabled={loading}
                      />
                    }
                    label={usuario.ativo ? 'Ativo' : 'Inativo'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handleOpenDialog(usuario)} 
                    color="primary"
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(usuario.id)} 
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
            />
            {!editingUser && (
              <TextField
                label="Senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                fullWidth
                required
                disabled={loading}
              />
            )}
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                label="Tipo"
                required
                disabled={loading}
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="financeiro">Financeiro</MenuItem>
                <MenuItem value="membro">Membro</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
            />
            <TextField
              label="Telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleInputChange}
              fullWidth
              required
              disabled={loading}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 