# Sistema de Gestão para Engenharia e Construção

## Descrição
Sistema completo para gestão de projetos de engenharia e construção, com controle de usuários, projetos, tarefas e financeiro.

## Requisitos
- Node.js (versão 14 ou superior)
- MySQL
- npm ou yarn

## Instalação

### Backend
1. Entre na pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as variáveis conforme necessário:
  ```
  DB_HOST=localhost
  DB_USER=seu_usuario
  DB_PASS=sua_senha
  DB_NAME=engenharia_db
  DB_PORT=3306
  JWT_SECRET=sua_chave_secreta
  PORT=3001
  ```

4. Crie o banco de dados:
```sql
CREATE DATABASE engenharia_db;
```

5. Execute as migrações e seeds:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

6. Inicie o servidor:
```bash
npm run dev
```

### Frontend
1. Em outro terminal, entre na pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Acesso ao Sistema
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### Credenciais Iniciais
- Email: admin@admin.com
- Senha: admin123

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

## Tecnologias Utilizadas
- Frontend:
  - React
  - TypeScript
  - Material-UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MySQL
  - Sequelize
  - JWT para autenticação

## Configuração
Crie um arquivo `.env` na pasta backend com as seguintes variáveis:
```
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=seu_segredo_jwt
PORT=3001
``` 