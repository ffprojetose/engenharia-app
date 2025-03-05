# Sistema de Gestão para Engenharia e Construção

## Descrição
Sistema completo para gestão de projetos de engenharia e construção, com controle de usuários, projetos, tarefas e financeiro.

## Funcionalidades Principais

### Usuários
- Administradores (acesso total)
- Membros (acesso controlado pelo administrador)

### Módulos
1. Gestão de Clientes
   - Cadastro completo
   - Histórico de projetos
   - Documentação

2. Gestão de Membros
   - Cadastro de funcionários
   - Controle de permissões
   - Histórico de atividades

3. Projetos
   - Criação e gestão de projetos
   - Etapas e marcos
   - Documentação técnica
   - Cronograma

4. Tarefas
   - Criação e atribuição
   - Acompanhamento de progresso
   - Prazos e prioridades

5. Calendário
   - Agendamento de reuniões
   - Eventos importantes
   - Lembretes

6. Parceiros e Fornecedores
   - Cadastro
   - Histórico de fornecimento
   - Avaliações

7. Financeiro
   - Orçamentos
   - Controle de custos
   - Faturamento
   - Relatórios

## Requisitos Técnicos
- Node.js
- MongoDB
- React.js

## Instalação
1. Clone o repositório
2. Instale as dependências do backend: `cd backend && npm install`
3. Instale as dependências do frontend: `cd frontend && npm install`
4. Configure as variáveis de ambiente
5. Inicie o servidor: `npm run dev`

## Configuração
Crie um arquivo `.env` na pasta backend com as seguintes variáveis:
```
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_segredo_jwt
PORT=3001
``` 