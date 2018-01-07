let {Resistor, Circuit, Net, Nets} = require('../src')
let r1 = Resistor('1k 0603')
let r2 = r1.copy()
r1.equals(r2) // true
let [vcc, vout, gnd] = Nets(3)

let circuit = Circuit()
circuit.connect(vcc, r1, r2)
//circuit.connect_through(vcc, r1, vout, r2, gnd)
console.log(JSON.stringify(circuit, null, 2))
//export circuit
