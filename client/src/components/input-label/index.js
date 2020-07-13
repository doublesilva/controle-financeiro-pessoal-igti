import React from "react";

import "./style.css"


export default function InputLabel(props) {
  return (
    <div className="inputLabel">
      <label className="labelText">{props.LabelText}</label>
      <label className={`labelValue ${ props.ClassInputValue}`}>{props.InputValue}</label>
    </div>
  );
}
