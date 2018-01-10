const {Capacitor, Resistor, Circuit, Net, Nets} = require('../lib')
const r1 = Resistor('1k')
const c1 = Capacitor('1uF')

const [vin, vout, gnd] = Nets()

const circuit = Circuit()

circuit.connect(vin, r1)
circuit.connect(r1.pin2, vout)
circuit.connect(r1.pin2, c1)
circuit.connect(c1.pin2, gnd)
console.log(JSON.stringify(circuit.toYosys(), null, 2))
