import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Usuarios from './pages/Usuarios/Usuarios';
import { Clientes } from './pages/Clientes/Clientes';
import Projetos from './pages/Projetos/Projetos';
import { Tarefas } from './pages/Tarefas/Tarefas';
import { Reunioes } from './pages/Reunioes/Reunioes';
import { Fornecedores } from './pages/Fornecedores/Fornecedores';
import { Financeiro } from './pages/Financeiro/Financeiro';
import { Relatorios } from './pages/Relatorios/Relatorios';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="projetos" element={<Projetos />} />
        <Route path="tarefas" element={<Tarefas />} />
        <Route path="reunioes" element={<Reunioes />} />
        <Route path="fornecedores" element={<Fornecedores />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="relatorios" element={<Relatorios />} />
      </Route>
    </>
  )
); 