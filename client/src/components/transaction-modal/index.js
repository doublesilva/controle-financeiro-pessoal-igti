import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { Form, Col } from "react-bootstrap";
import "./style.css";

export default function TransactionModal(props) {  
  const [validated, setValidated] = React.useState(false);
  const [transaction, setTransaction] = React.useState({})
      

  const handleChanTransaction = (entity) => {
    setTransaction({...transaction, ...entity})
  }

  useEffect(() =>{
    console.log('useEffect', props.Transaction)    
    handleChanTransaction(props.Transaction);    
  }, [props.Transaction])

  const handleSubmit = (event) => {    
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
        console.log('handleSubmit=Transaction', transaction);
        props.OnSubmit(transaction);
        setTransaction({});
        props.onHideModal();
    }

    setValidated(true);
  };
 
  const handleHideModal = () => {    
    props.onHideModal();
  };

  const handleCheckedChange = (e) => {    
    handleChanTransaction({type: e.target.value});
  };

 

  return (
    <Modal
      show={props.ShowModal}
      onHide={handleHideModal}
      backdrop="static"
      keyboard={false}
    >
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{props.ModalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="formModal">
            <Form.Group controlId={`validateType${props.ModalTitle.length}`}>
              <Form.Check
                name="type"
                value="-"
                onChange={handleCheckedChange}
                checked={transaction.type === "-"}
                disabled={transaction.id}
                inline
                id={`ckTypeDespesa${props.ModalTitle.length}`}
                label="Despesa"
                type="radio"
                required
              />
              <Form.Check
                name="type"
                value="+"
                onChange={handleCheckedChange}
                checked={transaction.type === "+"}
                disabled={transaction.id}
                id={`ckTypeReceita${props.ModalTitle.length}`}
                inline
                label="Receita"
                type="radio"
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, selecione uma Receita ou Despesa
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId={`validateDescription${props.ModalTitle.length}`}>
              <Form.Label>Descrição:</Form.Label>
              <Form.Control
                type="text"
                value={transaction.description}
                onChange={(e) => handleChanTransaction({description: e.target.value})}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe uma descrição
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId={`validateCategory${props.ModalTitle.length}`}>
              <Form.Label>Categoria:</Form.Label>
              <Form.Control
                type="text"
                value={transaction.category}
                onChange={(e) => handleChanTransaction({category: e.target.value})}
                required
              />
              <Form.Control.Feedback type="invalid">
                Por favor, informe uma categoria
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Row>
              <Form.Group as={Col} md="7" controlId={`validateValue${props.ModalTitle.length}`}>
                <Form.Label>Valor:</Form.Label>
                <Form.Control
                  type="number"
                  required step=".01"
                  value={transaction.value}
                  onChange={(e) => handleChanTransaction({value: e.target.value})}
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, informe um valor
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="5" controlId={`validateDate${props.ModalTitle.length}`}>
                <Form.Label>&nbsp;</Form.Label>
                <Form.Control
                  type="date"
                  className="form-control"
                  value={transaction.yearMonthDay}
                  onChange={(e) => handleChanTransaction({yearMonthDay: e.target.value})}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, selecione um período.
                </Form.Control.Feedback>
              </Form.Group>
            </Form.Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="btn btn-success">
            SALVAR
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
