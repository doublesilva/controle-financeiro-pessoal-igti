import React from "react";
import InputLabel from "../input-label";
import "./style.css";
const formattedMoney =  new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});
export default function TransactionTotal(props) {
  const somatorio = props.Transactions.filter(transaction => !props.Filter || transaction.description.toLowerCase().includes(props.Filter.toLowerCase())).reduce(
    (acumulador, proximo) => {
      acumulador.lancamento += 1;
      if (proximo.type === "+") acumulador.receita += proximo.value;
      else acumulador.despesa += proximo.value;
      return acumulador;
    },
    { lancamento: 0, receita: 0, despesa: 0, saldo: 0 },
  );
  somatorio.saldo = somatorio.receita - somatorio.despesa;
  return (
    <div className="formInline">
      <InputLabel
        LabelText="Lançamentos:"
        ClassInputValue=""
        InputValue={somatorio.lancamento}
      />
      <InputLabel
        LabelText="Receitas:"
        ClassInputValue="positivo"
        InputValue={formattedMoney.format(somatorio.receita)}
      />
      <InputLabel
        LabelText="Despesas:"
        ClassInputValue="negativo"
        InputValue={formattedMoney.format(somatorio.despesa)}
      />
      <InputLabel
        LabelText="Saldo:"
        ClassInputValue={+somatorio.saldo > 0 ? "positivo" : "negativo"}
        InputValue={formattedMoney.format(somatorio.saldo)}
      />
    </div>
  );
}
