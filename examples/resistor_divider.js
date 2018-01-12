const {
  Resistor,
  Circuit,
  Net,
  Nets,
  Power,
  Ground,
  Output,
  Input,
} = require('../lib');

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

const circuit = resistor_divider('1k', '500 ohm');
console.log(circuit)
console.log(JSON.stringify(circuit.toYosys(), null, 2));
