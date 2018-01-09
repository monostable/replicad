const {Resistor, Circuit, Net, Nets} = require('../lib')
const r1 = Resistor('1k 0603')
const r2 = r1.copy()
r1.equals(r2) // true
const [vcc, vout] = Nets()
const gnd = Net()

const circuit = Circuit()
circuit.connect(vcc, r1, r2)
//circuit.connect_through(vcc, r1, vout, r2, gnd)
console.log(circuit.toYosys())
//export circuit
