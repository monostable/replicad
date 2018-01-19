const __replicad__warnings__ = [];
const __replicad__errors__ = [];

const {
  Power,
  Ground,
  Output,
  Circuit
} = require('../lib');

const ResistorDivider = require('./resistor_divider');

const div1 = new ResistorDivider('div1', '1k', '500 ohm');
const div2 = new ResistorDivider('div2', '2k', '3k');
const circuit = Circuit("resistor_network.circuit");
const vcc = Power("vcc");
const gnd = Ground("gnd");
const vout = Output("vout");
circuit.connect(vcc, div1.vcc, div2.vcc);
console.log(circuit);

