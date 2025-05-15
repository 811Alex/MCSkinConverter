function randWUnit(unit='', max=1, min=0, decimal=false){
  let n = Math.random() * (max - min) + min;
  return (decimal ? n : Math.floor(n)) + unit;
}

function randBool(){
  return Math.random() < 0.5;
}

export {randWUnit, randBool};
