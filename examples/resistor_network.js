const { Power, Ground, Output, Circuit } = require('../lib');
const resistorDivider = require('./resistor_divider');
const div1 = resistorDivider('1k', '500 ohm');
const div2 = resistorDivider('2k', '3k');
const circuit = new Circuit();
const vcc = new Power();
const gnd = new Ground();
const vout = new Output();
circuit.connect([
    ((vcc.name = 'vcc'), vcc),
    ((div1.name = 'div1'), div1.vcc),
    ((div2.name = 'div2'), div2.vcc),
]);
console.log(circuit);
