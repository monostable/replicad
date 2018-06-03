import {
  npn,
  resistor,
  Circuit,
  Input,
  Output,
  Label,
  Ground
} from "../lib/index"

const q1 = npn()
const r1 = resistor("1k")

const circuit = new Circuit()

const vcc = new Label()
const vin = new Input()
const vout = new Output()

const gnds = {
  one: new Ground()
}

circuit.chain(vcc, r1, vout, q1.c)
circuit.connect(vin, q1.b)
circuit.connect(q1.e, gnds.one)

export default circuit
