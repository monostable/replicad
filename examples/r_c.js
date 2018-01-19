const {Capacitor, Resistor, Circuit, Label, Labels} = require('../lib')
const r1 = Resistor('1k')
const c1 = Capacitor('1uF')

const [vin, vout, gnd] = Labels('vin vout gnd')

const circuit = Circuit()

circuit.connect(vin, r1)
circuit.connect(r1.pin2, vout, c1)
circuit.connect(c1.pin2, gnd)
console.log(JSON.stringify(circuit.toYosys(), null, 2))
