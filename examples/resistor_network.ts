import { Power, Ground, Output, Circuit } from "../lib/index"
import resistorDivider from "./resistor_divider"

const div1 = resistorDivider("1k", "500 ohm")
const div2 = resistorDivider("2k", "3k")

const circuit = new Circuit()

const vcc = new Power()
const gnd = new Ground()

const vout = new Output()

circuit.connect(vcc, div1, div2)

console.log(circuit)
