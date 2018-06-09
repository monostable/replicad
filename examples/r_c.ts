import {
  capacitor,
  Circuit,
  ground,
  input,
  output,
  resistor
} from "../lib/index"

const r1 = resistor("1k")
const c1 = capacitor("1uF")

const vin = input()
const vout = output()
const gnd = ground()

const circuit = new Circuit()

circuit.chain(vin, r1, vout, c1, gnd)

export default circuit
