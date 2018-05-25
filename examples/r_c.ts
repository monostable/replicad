import {Capacitor, Resistor, Circuit, Input, Output, Ground} from '../lib/index'
const r1 = new Resistor('1k')
const c1 = new Capacitor('1uF')

const vin = new Input
const vout = new Output
const gnd = new Ground

const circuit = new Circuit

circuit.connect(vin, r1)
circuit.connect(r1.pin2, vout, c1)
circuit.connect(c1.pin2, gnd)
console.log(JSON.stringify(circuit.toYosys(), null, 2))
