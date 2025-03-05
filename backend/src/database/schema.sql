-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS engenharia_app;
USE engenharia_app;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'membro') DEFAULT 'membro',
    cargo VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    tipo ENUM('pessoa_fisica', 'pessoa_juridica') NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco JSON,
    contatos JSON,
    observacoes TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de projetos
CREATE TABLE IF NOT EXISTS projetos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    cliente_id INT,
    responsavel_id INT,
    data_inicio DATE NOT NULL,
    data_previsao_fim DATE NOT NULL,
    data_fim_real DATE,
    status ENUM('em_planejamento', 'em_andamento', 'pausado', 'concluido', 'cancelado') DEFAULT 'em_planejamento',
    orcamento JSON,
    documentos JSON,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
);

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    projeto_id INT,
    responsavel_id INT,
    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',
    status ENUM('pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada') DEFAULT 'pendente',
    data_inicio DATE NOT NULL,
    data_previsao_fim DATE NOT NULL,
    data_fim_real DATE,
    horas_estimadas FLOAT,
    horas_gastas FLOAT DEFAULT 0,
    anexos JSON,
    comentarios JSON,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id),
    FOREIGN KEY (responsavel_id) REFERENCES usuarios(id)
);

-- Tabela de reuniões
CREATE TABLE IF NOT EXISTS reunioes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    tipo ENUM('interna', 'cliente', 'fornecedor') NOT NULL,
    projeto_id INT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    local JSON NOT NULL,
    participantes JSON,
    pauta JSON,
    decisoes JSON,
    ata JSON,
    anexos JSON,
    observacoes TEXT,
    status ENUM('agendada', 'em_andamento', 'concluida', 'cancelada') DEFAULT 'agendada',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    inscricao_estadual VARCHAR(20),
    endereco JSON,
    contatos JSON,
    categorias JSON,
    produtos JSON,
    avaliacoes JSON,
    documentos JSON,
    observacoes TEXT,
    status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de relacionamento entre fornecedores e projetos
CREATE TABLE IF NOT EXISTS fornecedor_projetos (
    fornecedor_id INT,
    projeto_id INT,
    PRIMARY KEY (fornecedor_id, projeto_id),
    FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id),
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
);

-- Tabela de financeiro
CREATE TABLE IF NOT EXISTS financeiro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transacoes JSON,
    orcamentos JSON,
    saldo_atual DECIMAL(10, 2) DEFAULT 0,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 