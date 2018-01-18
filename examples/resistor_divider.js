const {Resistor, Circuit, Power, Ground, Output} = require('../lib');

class ResistorDivider extends Circuit {
  constructor(name, value1, value2) {
    super(name)
    const r1 = Resistor(value1);
    const r2 = Resistor(value2);

    const vcc = Power();
    const gnd = Ground();

    const vout = Output();

    this.chain(vcc, r1, vout, r2, gnd);
  }
}

if (require.main === module) {
  const circuit = new ResistorDivider('1k', '500 ohm');
  console.log(JSON.stringify(circuit.toYosys(), null, 2));
} else {
  module.exports = ResistorDivider;
}
