require("./config/config");
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const path = require("path");

const db = require("./data/index");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Vinculando o React ao app
 */
app.use(express.static(path.join(__dirname, "client/build")));

/**
 * Rota raiz
 */
app.get("/api/", (_, response) => {
  response.send({
    message:
      "Bem-vindo à API de lançamentos. Acesse /transaction e siga as orientações",
  });
});

/**
 * Rotas principais do app
 */
app.use("/api/transaction", routes);

/**
 * Conexão ao Banco de Dados
 */

console.log("Iniciando conexão ao MongoDB...");
db.mongoose.connect(
  db.url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      connectedToMongoDB = false;
      console.error(`Erro na conexão ao MongoDB - ${err}`);
    }
  }
);

db.mongoose.connection.once("open", () => {
  connectedToMongoDB = true;
  console.log("Conectado ao MongoDB");

  /**
   * Definição de porta e
   * inicialização do app
   */
  const APP_PORT = process.env.PORT || 3002;
  app.listen(APP_PORT, () => {
    console.log(`Servidor iniciado na porta ${APP_PORT}`);
  });
});

module.exports = app;
