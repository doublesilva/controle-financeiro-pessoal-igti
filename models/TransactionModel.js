const mongoose = require("mongoose");
const schemaModel = () => {
  let schema = mongoose.Schema({
    description: {
     type: String,
     required: true
    },
    value: {
      type: Number,
      required: true
     },
    category: {
      type: String,
      required: true
     },
    year: {
      type: Number,
      required: true,
      min: new Date().getFullYear() -1
     },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12
     },
    day:{
      type: Number,
      required: true,
      min: 1,
      max: 31
     },
    yearMonth:{
      type: String,
      required: true,
      min: 1,
      max: 31
     },
    yearMonthDay:{
      type: String,
      required: true
     },
    type:{
      type: String,
      required: true
     }
  }, {
    toJSON:
    { transform: function(doc, ret){      
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;         
    }}
  });
  
 return mongoose.model('transaction', schema);
  
};

module.exports = schemaModel;