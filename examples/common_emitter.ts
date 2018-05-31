import {
  Transistor,
  Resistor,
  Circuit,
  Input,
  Output,
  Label,
  Ground
} from "../lib/index"

const q1 = new Transistor('npn')
const r1 = new Resistor('1k')

const circuit = new Circuit()

const vcc = new Label()
const vin = new Input()
const vout = new Output()
const gnd = new Ground()

circuit.chain(vcc, r1, vout, q1[0])
circuit.connect(vin, q1[1])
circuit.connect(q1[2], gnd)

export default circuit
