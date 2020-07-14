import React from "react";
import Alert from "react-bootstrap/Alert";

import TransactionNav from "./components/transaction-nav";
import TransactionTotal from "./components/transaction-total";
import TransactionFilterNew from "./components/transaction-filter-new";
import TransactionModal from "./components/transaction-modal";
import TransactionGrid from "./components/transaction-grid";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export default function App() {
  const [transactionEdit, setTransaction] = React.useState({});
  const [transactions, setTransactions] = React.useState([]);
  const [showModalNew, setShowModalNew] = React.useState(false);
  const [showModalEdit, setShowModalEdit] = React.useState(false);
  const [yearMonth, setYearMonth] = React.useState();
  const [showAlert, setShowAlert] = React.useState(false);
  const [showAlertMessage, setShowAlertMessage] = React.useState(false);
  const [filterDescription, setFilterDescription] = React.useState();
  const onSetCloseNewModal = (show) => {
    setShowModalNew(show);
  };

  const onSetCloseEditModal = (show) => {
    setShowModalEdit(show);
  };

  const handleOnEdit = (transaction) => {
    setShowModalEdit(true);
    setTransaction({ ...transaction });
  };

  const handleOnDelete = (transaction) => {
    if (
      window.confirm("Você tem certeza que deseja remover este lançamento?")
    ) {
      fetch(`/api/transaction/${transaction.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      }).then(async (response) => {
        await response.json();
        handleChangeDate(yearMonth);
        messageAlert("Lançamento deletado com sucesso!!");
      });
    }
  };

  const handleChangeDate = (yearMonth) => {
    console.log('api-handleChangeDate',yearMonth);
    fetch(`/api/transaction/${yearMonth}`).then(async (response) => {      
      const result = await response.json();
      setTransactions(result);
    });
    setYearMonth(yearMonth);
  };

  const handleSubmitTransaction = (action, transaction) => {
    if (transaction.id) {
      console.log("Edit Transaction", action, transaction);
      fetch(`/api/transaction/${transaction.id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      }).then(async (response) => {
        const result = await response.json();
        if (result.message !== "Foi modificado 0 item")
          handleChangeDate(yearMonth);
        messageAlert("Lançamento atualizado com sucesso!!");
      });
    } else {
      fetch(`/api/transaction`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
      }).then(async (response) => {
        const result = await response.json();
        if (result.message === "Nova transação criada com sucesso") {
          messageAlert("Lançamento inserido com sucesso!!");
          handleChangeDate(yearMonth);
        }
      });
    }
  };
  const handleOnFilter = (filter) => {
    console.log('handleOnFilter', filter);
    setFilterDescription(filter);
  };
  const messageAlert = (message) => {
    setShowAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  return (
    <div className="app">
      <center>
        <h3>Bootcamp Full Stack - Desafio Final</h3>
        <p>Controle Financeiro Pessoal</p>
        <TransactionNav
          ChangeYearMonth={(yearMonth) => handleChangeDate(yearMonth)}
        />
        <TransactionTotal  Filter={filterDescription} Transactions={transactions} />
        <TransactionFilterNew
          OnFilter={(filter) => handleOnFilter(filter)}
          onSetShowModel={(show) => onSetCloseNewModal(show)}
        />
        <Alert className="fixed-bottom" show={showAlert} variant="success">
          <strong>
            <h4>{showAlertMessage}</h4>
          </strong>
        </Alert>

        <TransactionModal
          Transaction={{}}
          OnSubmit={(transaction) =>
            handleSubmitTransaction("new", transaction)
          }
          ModalTitle="Inclusão de lançamento"
          ShowModal={showModalNew}
          onHideModal={() => onSetCloseNewModal(false)}
        />
        <TransactionModal
          Transaction={transactionEdit}
          OnSubmit={(transaction) =>
            handleSubmitTransaction("edit", transaction)
          }
          ModalTitle="Edição de lançamento"
          ShowModal={showModalEdit}
          onHideModal={() => onSetCloseEditModal(false)}
        />
        <TransactionGrid
          OnDelete={(transaction) => handleOnDelete(transaction)}
          OnEdit={(transaction) => handleOnEdit(transaction)}
          Transactions={transactions} 
          Filter={filterDescription}
        />
      </center>
    </div>
  );
}
