import { Circuit, Ground, Output, Power, Resistor } from "../lib/index"

function resistorDivider(value1, value2) {
  const r1 = new Resistor(value1)
  const r2 = new Resistor(value2)

  const vcc = new Power()
  const gnd = new Ground()

  const vout = new Output()

  const circuit = new Circuit()
  circuit.chain(vcc, r1, vout, r2, gnd)
  return circuit
}

export default resistorDivider
