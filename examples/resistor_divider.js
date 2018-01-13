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

if (require.main === module) {
  const circuit = resistor_divider('1k', '500 ohm');
  console.log(JSON.stringify(circuit.toYosys(), null, 2))
} else {
  module.exports = resistor_divider;
}
