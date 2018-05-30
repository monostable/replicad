import {
  Capacitor,
  Resistor,
  Circuit,
  Label,
  Input,
  Output,
  Ground
} from "../lib/index"

const r1 = new Resistor("1k")
const c1 = new Capacitor("1uF")

const vin = new Input()
const vout = new Output()
const gnd = new Ground()

const circuit = new Circuit()

circuit.chain(vin, r1, vout, c1, gnd)

export default circuit
