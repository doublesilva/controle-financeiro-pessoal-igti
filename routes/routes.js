const express = require("express");
const db = require("../data/index");
const e = require("express");
const transactionRouter = express.Router();

const messageError = { error: " " };
transactionRouter.post("", async (request, response) => {
  if (!request.body) {
    messageError.error = "A requisição não pode ser vazia";
    response.send(messageError);
    return;
  }

  try {
    const entity = getEntityBody(request.body);
    const result = await db.transactions.create(entity);
    response.send({ message: 'Nova transação criada com sucesso', entity: result});
  } catch (error) {
    messageError.error = error.message;
    ressponse.send(messageError);
  }
});

const getEntityBody = (body) => {
  const { description, value, category, yearMonthDay, type } = body;
  const entity = { description, value, category, yearMonthDay, type };
  const data = yearMonthDay.split("-");
  entity.yearMonth = `${data[0]}-${data[1]}`;
  entity.year = `${data[0]}`;
  entity.month = `${data[1]}`;
  entity.day = `${data[2]}`;
  return entity;
};

transactionRouter.get("", async (request, response) => {  
  const transactions = await db.transactions.find({});
  response.send(transactions);
});

transactionRouter.get("/:period", async (request, response) => {
  const { period } = request.params;  
  if (new RegExp("^(\\d\\d\\d\\d-((0[1-9])|(1[0-2])))$").test(period)) {
    const transactions = await db.transactions.find({ yearMonth: period });
    response.send(transactions);
  } else {
    messageError.error =
      "Valor do período inválido, o valor deve estar no formato yyyy-mm";
    response.status(500).send(messageError);
  }
});

transactionRouter.put("/:id", async (request, response) => {
  if (!request.body) {
    messageError.error = "A requisição não pode ser vazia";
    response.status(500).send(messageError);
    return;
  }
  if (!request.params.id) {
    messageError.error =
      "Obrigatório passar o id por parâmetro da entidade a ser alterada";
    response.status(500).send(messageError);
    return;
  }

  try {
    const { id } = request.params;
    const entity = getEntityBody(request.body);
    const { nModified } = await db.transactions.updateOne({ _id: id}, entity);
    response.send({message: `Foi modificado ${nModified} item`});
  } catch (error) {
    messageError.error = error.message;
    response.status(500).send(messageError);
  }
});

transactionRouter.delete("/:id", async (request, response) => {
  if (!request.params.id) {
    messageError.error =
      "Obrigatório passar o id por parâmetro da entidade a ser alterada";
    response.status(500).send(messageError);
    return;
  }

  try {
    const { id } = request.params;
    const { deletedCount } = await db.transactions.deleteOne({ _id: id});
    response.send({ message: `Foi deletado ${deletedCount} item`});
  } catch (error) {
    messageError.error = error.message;
    response.status(500).send(messageError);
  }
});

module.exports = transactionRouter;
