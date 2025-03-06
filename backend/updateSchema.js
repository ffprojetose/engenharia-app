const sequelize = require('./src/config/database');

async function updateSchema() {
  try {
    // Verificar se a coluna cargo existe
    const [cargoExists] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = 'engenharia_app'
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'cargo'
    `);

    if (!cargoExists[0].count) {
      // Adicionar coluna cargo
      await sequelize.query(`
        ALTER TABLE usuarios
        ADD COLUMN cargo VARCHAR(255) NOT NULL DEFAULT 'Não especificado'
      `);
    }

    // Verificar se a coluna telefone existe
    const [telefoneExists] = await sequelize.query(`
      SELECT COUNT(*) as count
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = 'engenharia_app'
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'telefone'
    `);

    if (!telefoneExists[0].count) {
      // Adicionar coluna telefone
      await sequelize.query(`
        ALTER TABLE usuarios
        ADD COLUMN telefone VARCHAR(255)
      `);
    }

    console.log('Schema atualizado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao atualizar schema:', error);
    process.exit(1);
  }
}

updateSchema(); 