const {Resistor, Circuit, Net, Nets} = require('../lib')
const r1 = Resistor('1k 0603')
const r2 = Resistor('500 ohm 0603')
const [vcc, vout] = Nets()
const gnd = Net()

const circuit = Circuit()
circuit.connect(vcc, r1)
circuit.connect(r1.pin1, vout)
circuit.connect(vout, r2)
circuit.connect(r2.pin1, gnd)
//circuit.connect_through(vcc, r1, vout, r2, gnd)
console.log(JSON.stringify(circuit.toYosys(), null, 2))
//export circuit
