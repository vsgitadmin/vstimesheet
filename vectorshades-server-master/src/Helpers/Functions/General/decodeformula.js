const decodeFormula = (formula, object) => {
    let splited = formula.split(/[+-/()*%]+/)  
    splited.filter((e) => e !== '').forEach((variable) => {
        if(isNaN(variable)) formula = formula.replace(variable, object[variable]) 
    })
    let value = eval(formula).toFixed(2)
    return value
}

function convertHrsStrToDecimal(timeStr) {
    // Match hours and minutes (e.g. "2h 18m")
    const match = timeStr.match(/(\d+)\s*h\s*(\d+)\s*m/i);
    if (!match) {
      throw new Error(`Invalid format: "${timeStr}". Expected "Xh Ym".`);
    }
  
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
  
    // Compute total hours in decimal form, rounded to one decimal place
    const total = hours + minutes / 60;
    const rounded = Math.round(total * 10) / 10;
  
    // If the rounded value is an integer, return without decimal
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }

module.exports = {decodeFormula,convertHrsStrToDecimal}
