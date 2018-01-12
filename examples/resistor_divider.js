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

const r1 = Resistor('1k 0603');
const r2 = Resistor('500 ohm 0603');

const vcc = Power();
const gnd = Ground();

const vout = Output();

const circuit = Circuit();
circuit.chain(vcc, r1, vout, r2, gnd);
console.log(JSON.stringify(circuit.toYosys(), null, 2));
