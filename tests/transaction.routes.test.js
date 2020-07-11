require("../config/config");
const app = require("../index");
const { ok, deepEqual } = require("assert");
const recreateCollections = require("../data/populateMongoDb");
const request = require("request");

const urlBase = "http://localhost:3002/api/transaction";
const POST_DATA = {
  description: "Consultoria de desenvolvimento de sistemas",
  value: 10,
  category: "Receita",
  yearMonthDay: "2019-01-02",
  type: "-",
};
let id = "";
describe("Transaction Routes Suite Test", function () {
  this.timeout(Infinity);

  this.beforeAll(async () => {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
  });

  it("Deve fazer um GET api/transaction deve retornar todas as transações", async () => {
    const expected = 2596;
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.get(
        {
          url: urlBase,
          json: {}
        },
        function (error, response, body) {
          try {
            const data = body;
            statusCode = response.statusCode;
            actual = data.length;
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
    ok(statusCode == 200);
    deepEqual(actual, expected);
  });

  it("Deve fazer um GET api/transaction/:period filtrando as transações por periodo", async () => {
    const expected = 75;
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.get(
        {
          url: urlBase + "/" + "2019-01",
          json: {}
        },
        function (error, response, body) {
          try {
            const data = body;
            statusCode = response.statusCode;
            actual = data.length;
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
    ok(statusCode == 200);
    deepEqual(actual, expected);
  });

  it("Deve fazer um GET api/transaction/:period e retornar um erro ao informar periodo em formato errado", async () => {
    const expected =
      "Valor do período inválido, o valor deve estar no formato yyyy-mm";
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.get(
        {
          url: urlBase + "/" + "2019-1",
          json: {}
        },
        function (error, response, body) {
          try {
            const data = body;
            statusCode = response.statusCode;
            actual = data.error;
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
    ok(statusCode == 500);
    deepEqual(actual, expected);
  });

  it("Deve fazer POST api/transaction passando uma transaction", async () => {
    const expected = "Nova transação criada com sucesso";
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.post(
        {
          url: urlBase,
          json: POST_DATA,
        },
        function (error, response, body) {
          try {
            const { message: actual, entity } = body;
            id = entity.id;
            statusCode = response.statusCode;
            ok(statusCode == 200);
            deepEqual(actual, expected);
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
  });

  it("Deve fazer PUT api/transaction/:id passando o id e a transação que deseja alterar", async () => {
    const expected = "Foi modificado 1 item";
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.put(
        {
          url: urlBase + "/" + id,
          json: {
            ...POST_DATA,
            description: "Mercado Silva",
            value: 250,
            type: "-",
          },
        },
        function (error, response, body) {
          try {
            
            const { message: actual } = body;            
            statusCode = response.statusCode;
            ok(statusCode == 200);            
            deepEqual(actual, expected);
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
  });

  it("Deve fazer DELETE api/transaction/:id passando o id e a transação que deseja alterar", async () => {
    const expected = "Foi deletado 1 item";
    let actual = 0;
    let statusCode = 0;
    await new Promise((resolve, reject) => {
      request.delete(
        {
          url: urlBase + "/" + id,
          json: {}
        },
        function (error, response, body) {
          try {
            const { message: actual } = body; 
            statusCode = response.statusCode;
            ok(statusCode == 200);            
            deepEqual(actual, expected);
            resolve();
          } catch (error) {
            ok(false, error.message);
            reject();
          }
        }
      );
    });
  });

  this.afterAll(async () => {
    await recreateCollections();
  });
});
