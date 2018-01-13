const {Resistor, Circuit, Power, Ground, Output} = require('../lib');

function resistor_divider(value1, value2) {
  const r1 = Resistor(value1);
  const r2 = Resistor(value2);

  const vcc = Power();
  const gnd = Ground();

  const vout = Output();

  const circuit = Circuit();
  circuit.chain(vcc, r1, vout, r2, gnd);

  return circuit;
}

module.exports = resistor_divider;
