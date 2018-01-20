const {Resistor, Circuit, Power, Ground, Output} = require('../lib');

function ResistorDivider(name, value1, value2) {
  const r1 = new Resistor('r1', value1);
  const r2 = new Resistor('r2', value2);

  const vcc = new Power();
  const gnd = new Ground();

  const vout = new Output();

  const circuit = Circuit();
  circuit.chain(vcc, r1, vout, r2, gnd);
  return circuit;
}

if (require.main === module) {
  const circuit = ResistorDivider('div', '1k', '500 ohm');
  console.log(JSON.stringify(circuit.toYosys(), null, 2));
} else {
  module.exports = ResistorDivider;
}
