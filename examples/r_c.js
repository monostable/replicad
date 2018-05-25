const {Capacitor, Resistor, Circuit, Input, Output, Ground} = require('../lib');
const r1 = new Resistor('1k');
const c1 = new Capacitor('1uF');

const vin = new Input();
const vout = new Output();
const gnd = new Ground();

const circuit = new Circuit();

circuit.connect([((vin.name = 'vin'), vin), ((r1.name = 'r1'), r1)]);
circuit.connect([
  ((r1.name = 'r1'), r1.pin2),
  ((vout.name = 'vout'), vout),
  ((c1.name = 'c1'), c1),
]);
circuit.connect([((c1.name = 'c1'), c1.pin2), ((gnd.name = 'gnd'), gnd)]);
console.log(JSON.stringify(circuit.toYosys(), null, 2));
