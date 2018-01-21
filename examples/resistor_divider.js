const {Resistor, Circuit, Power, Ground, Output} = require('../lib');

function resistorDivider(value1, value2) {
  const r1 = Resistor(value1);
  const r2 = Resistor(value2);

  const vcc = Power();
  const gnd = Ground();

  const vout = Output();

  const circuit = Circuit();
  circuit.chain([
    ((vcc.name = 'vcc'), vcc),
    ((r1.name = 'r1'), r1),
    ((vout.name = 'vout'), vout),
    ((r2.name = 'r2'), r2),
    ((gnd.name = 'gnd'), gnd),
  ]);
  return circuit;
}

if (require.main === module) {
  const circuit = resistorDivider('1k', '500 ohm');
  console.log(JSON.stringify(circuit.toYosys(), null, 2));
} else {
  module.exports = resistorDivider;
}
