const db = require('./index');
const { model } = require('mongoose');
const fs = require('fs').promises;


/**
 * Crie um arquivo .env na raiz da pasta 'utils' e
 * preencha os valores conforme o arquivo de
 * exemplo "".env.example"
 *
 * DB_CONNECTION
 */
// const TRANSACTIONS_COLLECTION = 'transactions';

// console.log('Iniciando conexão ao MongoDB...');
// db.mongoose.connect(
//   db.url,
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   },
//   (err) => {
//     if (err) {
//       console.error(`Erro na conexão ao MongoDB - ${err}`);
//       process.exit(1);
//     }
//   }
// );

// db.mongoose.connection.once('open', () => {
//   console.log('Conectado ao MongoDB');
//   recreateCollections();
// });

async function recreateCollections() {
  console.log('Eliminando todos os documentos...');
  await dropAllDocuments();

  console.log('Importando os documentos...');
  await populateCollections();

  console.log('Processamento finalizado!');
}

async function dropAllDocuments() {
  const promiseTransactions = new Promise((resolve, reject) => {
    db.transactions.deleteMany()
      .then(() => {
        resolve();
      })
      .catch((err) => {
        if (err.code === 26) {
          resolve();
          return;
        }

        reject(err);
      });
  });

  await Promise.all([promiseTransactions]);
}

async function populateCollections() {
  const promiseTransactions = new Promise(async (resolve, reject) => {
    const stringArrayTransactions = await fs.readFile(
      './data/transactionsArray.json',
      'utf-8'
    );

    const transactions = JSON.parse(stringArrayTransactions);

    db.transactions.insertMany(transactions)
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  await Promise.all([promiseTransactions]);
}

module.exports = recreateCollections;