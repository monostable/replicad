import { Circuit, input, resistor, led } from "../lib/index"

const x1 = input()
const x2 = input()
const x3 = input()

const r1 = resistor("1k")
const r2 = resistor("1k")
const r3 = resistor("1k")

const led1 = led()
const led2 = led()
const led3 = led()
const led4 = led()
const led5 = led()
const led6 = led()

const circuit = new Circuit()

circuit.chain(x1, r1, led1, r2[1], led3, r3, x3)
circuit.connect(x2, r2[0])
circuit.chain(r3[0], led4, r2[1], led2, r1[1])
circuit.chain(r1, led5, r3)
circuit.chain(r3[0], led6, r1[1])

export default circuit
