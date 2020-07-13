import React from "react";

import "./style.css";

export default function TransactionFilterNew(props) {
    const handleClickModal = (e) =>{
        props.onSetShowModel(true);
    }
  return (
    <div className="divfilterNew">
      <button type="button" className="btn btn-success"  onClick={handleClickModal}>
        <i className="fa fa-plus"></i> NOVO LANÇAMENTO
      </button>
      <input type="text" onChange={(e) => props.OnFilter(e.target.value)} placeholder="Filtro" />
    </div>
  );
}
