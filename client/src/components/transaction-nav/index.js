import React from "react";
import "./style.css";


var nomeMeses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEC'];

function getYearMonths() {
  const yearMonths = [];
  const yearNow = new Date().getFullYear();
  let years = [yearNow - 1, yearNow, yearNow + 1];
  for (const year of years) {
    for (let month = 1; month <= 12; month++) {
      const key = `${year}-${month.toString().padStart(2, "0")}`;
      const value = `${nomeMeses[month-1]}/${year}`;      
      yearMonths.push({key, value});
    }
  }
  return yearMonths;
}
const yearNow = new Date().getFullYear();
const monthNow = (new Date().getMonth() + 1).toString().padStart(2, "0");

export default function TransactionNav(props) {
  const [yearMonth, setYearMonth] = React.useState(`${yearNow}-${monthNow}`);
  const [disablePrevious=false, setDisablePrevious] = React.useState();
  const [disableNext=false, setDisableNext] = React.useState();

  const yearMonths = getYearMonths();
  
  React.useEffect(() => {
    const data = yearMonth.split("-");
    if (+data[1] === 1 && +data[0] === (yearNow - 1)) {
        setDisablePrevious(true);
      } else   setDisablePrevious(false);

      if (+data[1] === 12 && +data[0] === (yearNow + 1)) {
        setDisableNext(true);
      } else   setDisableNext(false);
      // eslint-disable-next-line
      props.ChangeYearMonth(yearMonth);
  }, [yearMonth])

  const handleClickPrevious = () => {
    const result = setMonth(-1);
    setYearMonth(result);        
  };

  const handleClickNext = () => {
    const result = setMonth(1);
    setYearMonth(result);    
  };

  const setMonth = (increment) =>{
    const data = yearMonth.split("-");
    if (+data[1] === 12 && increment === 1) {
      data[0] = +data[0] + increment;
      data[1] = 1;
    } else if(+data[1] ===1 && increment === -1){
        data[0] = +data[0] + increment;
        data[1] = 12;
    }
    else data[1] = +data[1] + increment;
    return `${data[0]}-${data[1].toString().padStart(2, "0")}`;
  }

  const handleChangeTransaction = (e) => {
    console.log('handleChangeTransaction', e.target.value);
    setYearMonth(e.target.value);    
  };

  return (
    <div className="transaction-nav">        
      <button
        type="button"
        disabled={disablePrevious}        
        onClick={handleClickPrevious}
        className="btn btn-success"
      >{`<`}</button>
      <select
        className="custom-select d-block w-80"
        onChange={handleChangeTransaction}        
        value={yearMonth}
        required=""
      >
        {yearMonths.map((item) => (
          <option key={item.key} value={item.key}>
            {item.value}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={disableNext} 
        onClick={handleClickNext}
        className="btn btn-success"
      >{`>`}</button>      
    </div>
  );
}
