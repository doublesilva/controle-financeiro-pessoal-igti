import React from "react";
import "./style.css";

const formattedMoney = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function TransactionGrid(props) {

    const handleClickEdit = (transaction) =>{
        console.log('handleClickEdit', transaction);
        props.OnEdit(transaction);
    }

    const handleClickDelete = (transaction) => {
        console.log('handleClickDelete', transaction);
        props.OnDelete(transaction);
    }


  return (
    <div className={`transactionGrid`}>
      {props.Transactions.sort((a, b)=> +a.day - +b.day).map((transaction) => (
        <div
          key={transaction.id}
          className={`transactionGridItem ${
            transaction.type === "+" ? "positivo" : "negativo"
          }`}
        >
          <div className="transactionGridDay">
            <label>{transaction.day}</label>
          </div>
          <div className="transactionGridDescription">
            <label>
              <b>{transaction.category}</b>
            </label>
            <label>{transaction.description}</label>
          </div>
          <div className="transactionGridValue">
            <label>{formattedMoney.format(transaction.value)}</label>
          </div>
          <div className="transactionGridActions">
            <button type="button" className="btn" onClick={() => handleClickDelete(transaction)}>
              <i className="fa fa-trash"></i>
            </button>
            <button type="button" className="btn" onClick={() => handleClickEdit(transaction)}>
              <i className="fa fa-pencil"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
