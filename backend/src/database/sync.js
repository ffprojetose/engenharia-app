const connection = require('./index');

async function syncDatabase() {
  try {
    await connection.sync({ force: true });
    console.log('Banco de dados sincronizado com sucesso!');
    process.exit();
  } catch (error) {
    console.error('Erro ao sincronizar banco de dados:', error);
    process.exit(1);
  }
}

syncDatabase(); 