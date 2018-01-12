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
const vin = Input();

const circuit = Circuit();
circuit.connect_through(vcc, r1, r2, gnd);
circuit.connect(r1.pin2, vout);
console.log(JSON.stringify(circuit.toYosys(), null, 2));
