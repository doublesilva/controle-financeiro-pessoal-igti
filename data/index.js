const mongoose = require("mongoose")
const schema = require('../models/TransactionModel')


const db = { };
const { connect, connection } = mongoose;
db.mongoose = { connect, connection};
db.url = process.env.DB_CONNECTION;
db.transactions = schema(mongoose);

module.exports = db;