import {
  resistor,
  led,
  Circuit,
  Label,
  Input,
  Output,
  Ground
} from "../lib/index"

const r1 = resistor("1k")
const led1 = led("red")

const vin = new Input()
const gnd = new Ground()

const circuit = new Circuit()

circuit.chain(vin, r1, led1, gnd)

export default circuit
