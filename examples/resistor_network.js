const {Power, Ground, Output, Circuit} = require('../lib');
const resistor_divider = require('./resistor_divider');

const div1 = resistor_divider('1k', '500 ohm');
const div2 = resistor_divider('2k', '3k');

const circuit = Circuit();

const vcc = Power()
const gnd = Ground()

const vout = Output()

circuit.connect(vcc, div1.vcc, div2.vcc)

console.log(circuit)
