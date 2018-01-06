let {Resistor, Circuit, Net, Nets} = require('../src')
let r1 = new Resistor('1k 0603')
let r2 = r1.copy()
r1.equals(r2) // true
let [vcc, vout, gnd] = Nets(3)

let circuit = new Circuit()
circuit.connect(vcc, r1, r2)
//circuit.connect_through(vcc, r1, vout, r2, gnd)
console.log(circuit)
//export circuit
