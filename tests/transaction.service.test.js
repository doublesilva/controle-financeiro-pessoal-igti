require("../config/config");
const { ok, deepEqual, rejects } = require("assert");
const db = require("../data/index");
const recreateCollections = require("../data/populateMongoDb");
const { promises } = require("fs");

const State = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};
const TRANSACTION_INSERT = {
  description: "Compras em hortifruti",
  value: 32,
  category: "Mercado",
  year: 2019,
  month: 1,
  day: 2,
  yearMonth: "2019-01",
  yearMonthDay: "2019-01-02",
  type: "-",
};

const TRANSACTION_FILTER = {
    description: "Compras em hortifruti",    
    category: "Mercado",
    yearMonthDay: "2019-01-02",
    type: "-",
  };

describe("Transaction Service Suite Test", function () {
  this.timeout(Infinity);
  this.beforeAll(async () => {
    db.mongoose.connect(
      db.url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) {
          console.error(`Erro na conexão ao MongoDB - ${err}`);
        }
      }
    );

    await db.mongoose.connection.once("open", () => {
      console.log("Conectado ao MongoDB");
    });
    await recreateCollections();
  });

  it("Deve estar conectado ao banco", () => {
    const expected = State[1]; //Status de conectado
    const actual = State[db.mongoose.connection.readyState];
    deepEqual(actual, expected);
  });

  it("Deve verificar o número de registros no banco", async () => {
    const expected = 2596;
    const actual = (await db.transactions.find({})).length;
    deepEqual(actual, expected);
  });

  it("Deve retornar um item", async () => {
      const expected = TRANSACTION_INSERT;
      const {id, ...actual } = (await db.transactions.findOne(TRANSACTION_FILTER)).toJSON();      
      deepEqual(actual, expected);      
  })

  it("Deve inserir um item", async () => {
    const expected = TRANSACTION_INSERT;
    const {id, ...actual } = (await db.transactions.create(TRANSACTION_INSERT)).toJSON();      
    deepEqual(actual, expected);      
 })

 it("Deve deletar um item", async () => {
    const expected = 1;
    const [result] = (await db.transactions.find(TRANSACTION_FILTER));      
    const { deletedCount: actual } = await db.transactions.deleteOne({ _id: result.id });
    deepEqual(actual, expected);      
 })

 it("Deve atualizar um item", async () => {
    const expected = 1;
    const { nModified: actual } = (await db.transactions.updateOne(TRANSACTION_FILTER, { value: 50}));          
    deepEqual(actual, expected);      
 })

 it("Deve dar erro ao inserir item sem descricao", async () => {
    const expected = "transaction validation failed: description: Path `description` is required.";
    let actual = "";
    const SEM_DESCRICAO = { ...TRANSACTION_INSERT, description: ""}
    try {
        await db.transactions.create(SEM_DESCRICAO)
    } catch (error) {
        actual = error.message;
    }
    deepEqual(actual, expected);      
 })

 it("Deve dar erro ao inserir ano menor que o ano que passou", async () => {
    const expected = "transaction validation failed: year: Path `year` (2008) is less than minimum allowed value (2019).";
    
    const SEM_DESCRICAO = { ...TRANSACTION_INSERT, year: 2008 }
    let actual = "";
    try {
        await db.transactions.create(SEM_DESCRICAO);          
    } catch (error) {
        actual = error.message;
    }
    deepEqual(actual, expected);      
 })

});
