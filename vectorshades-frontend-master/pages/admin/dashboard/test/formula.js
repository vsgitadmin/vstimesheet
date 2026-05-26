import React, { useState } from 'react';

function FormulaInput(props) {
  props={}
  props.data = {
    x: 10,
    y: 20,
    z: 30,
  };
    const [formula, setFormula] = useState('');

  const handleFormulaChange = (event) => {
    setFormula(event.target.value);
  }

  const handleVariableClick = (variableName) => {
    setFormula(formula + variableName);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Formula:
        <input type="text" value={formula} onChange={handleFormulaChange} />
      </label>
      {Object.keys(props.data).map((variableName) => (
        <span key={variableName} onClick={() => handleVariableClick(variableName)}>{variableName}</span>
      ))}
      <input type="submit" value="Submit" />
    </form>
  );
}

export default FormulaInput