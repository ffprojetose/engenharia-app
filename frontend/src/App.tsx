import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { theme } from './theme/theme';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home/Home';
import Usuarios from './pages/Usuarios/Usuarios';
import { Clientes } from './pages/Clientes/Clientes';
import Projetos from './pages/Projetos/Projetos';
import { Tarefas } from './pages/Tarefas/Tarefas';
import { Reunioes } from './pages/Reunioes/Reunioes';
import { Fornecedores } from './pages/Fornecedores/Fornecedores';
import { Financeiro } from './pages/Financeiro/Financeiro';
import { Relatorios } from './pages/Relatorios/Relatorios';
import { Login } from './pages/Login/Login';
import { PrivateRoute } from './components/PrivateRoute/PrivateRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <Layout>
                  <Outlet />
                </Layout>
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="clientes" element={<Clientes />} />
            <Route path="projetos" element={<Projetos />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="reunioes" element={<Reunioes />} />
            <Route path="fornecedores" element={<Fornecedores />} />
            <Route path="financeiro" element={<Financeiro />} />
            <Route path="relatorios" element={<Relatorios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
