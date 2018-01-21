const {Capacitor, Resistor, Circuit, Input, Output, Ground} = require('../lib');
const r1 = Resistor('1k');
const c1 = Capacitor('1uF');

const vin = Input();
const vout = Output();
const gnd = Ground();

const circuit = Circuit();

circuit.connect([((vin.name = 'vin'), vin), ((r1.name = 'r1'), r1)]);
circuit.connect([
  ((r1.name = 'r1'), r1.pin2),
  ((vout.name = 'vout'), vout),
  ((c1.name = 'c1'), c1),
]);
circuit.connect([((c1.name = 'c1'), c1.pin2), ((gnd.name = 'gnd'), gnd)]);
console.log(JSON.stringify(circuit.toYosys(), null, 2));
