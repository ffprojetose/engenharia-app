const sequelize = require('../config/database');

async function updateSchema() {
  try {
    // Adicionar coluna cargo
    await sequelize.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS cargo VARCHAR(255) NOT NULL DEFAULT 'Não especificado'
    `);

    // Adicionar coluna telefone
    await sequelize.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS telefone VARCHAR(255)
    `);

    console.log('Schema atualizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao atualizar schema:', error);
    process.exit(1);
  }
}

updateSchema(); 