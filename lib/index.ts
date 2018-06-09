import electroGrammar = require("electro-grammar")

class Pin {
  public name: string
  public component: Component
  public direction: string
  constructor(component, name) {
    this.name = name
    this.component = component
  }
}

class Component {
  public type: string
  public name: string
  public pins: Pin[]
  public value: string
  constructor(description, numberOfPins = 2) {
    const g = electroGrammar.parse(description)
    this.type = g.type
    this.value = g.resistance || g.capacitance || g.color
    this.pins = []
    for (let i = 0; i < numberOfPins; i++) {
      const pin = new Pin(this, i)
      this.pins.push(pin)
      this[i] = pin
    }
    this.copy = this.copy.bind(this)
    this.equals = this.equals.bind(this)
  }
  public copy() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this)
    )
  }
  public equals(other) {
    const sameType = this.type === other.type
    const sameValue = this.value === other.value
    return sameType && sameValue
  }
}

function resistor(description) {
  return new Component("resistor " + description)
}

function capacitor(description) {
  return new Component("capacitor " + description)
}

function led(description) {
  return new Component("led " + description)
}

function npn(description) {
  return new Component("transistor npn " + description)
}

function pnp(description) {
  return new Component("transistor pnp " + description)
}

class Label {
  public name: string
  public direction: string
}

class Power extends Label {
  constructor() {
    super()
  }
}

class Ground extends Label {
  constructor() {
    super()
  }
}

class Input extends Label {
  constructor() {
    super()
  }
}

class Output extends Label {
  constructor() {
    super()
  }
}

function pinOrLabel(x) {
  return x instanceof Label || x instanceof Pin
}

class Circuit {
  public name: string
  public components: Component[]
  public labels: Label[]
  public nets: Array<Array<Pin | Label>>
  public subcircuits: Circuit[]
  constructor() {
    this.components = []
    this.labels = []
    this.subcircuits = []
    this.nets = []
    this.chain = this.chain.bind(this)
    this.connect = this.connect.bind(this)
    this._connect = this._connect.bind(this)
    this._add = this._add.bind(this)
    this.toYosys = this.toYosys.bind(this)
  }
  public chain(...elements: any[]) {
    elements.forEach((two, i) => {
      if (i > 0) {
        let one = elements[i - 1]
        this._add(one)
        this._add(two)
        // out of the first and into the second
        if (!pinOrLabel(one)) {
          one = one.pins[1]
        }
        if (!pinOrLabel(two)) {
          two = two.pins[0]
        }
        this._connect(one, two)
      }
    })
  }
  public connect(...elements: any[]) {
    elements.forEach((two, i) => {
      if (i > 0) {
        let one = elements[i - 1]
        // connect the tops of both
        if (!pinOrLabel(one)) {
          one = one.pins[0]
        }
        if (!pinOrLabel(two)) {
          two = two.pins[0]
        }
        this._connect(one, two)
      }
    })
  }
  public toYosys() {
    const ports = {}
    const cells = {}
    for (const c of this.labels) {
      if (c instanceof Power) {
        cells[c.name] = {
          type: "vcc",
          port_directions: {
            A: "output"
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))]
          }
        }
      } else if (c instanceof Ground) {
        cells[c.name] = {
          type: "gnd",
          port_directions: {
            A: "input"
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))]
          }
        }
      } else {
        const direction =
          c instanceof Output
            ? "output"
            : c instanceof Input ? "input" : c.direction
        ports[c.name] = {
          direction,
          bits: [2 + this.nets.findIndex(n => n.includes(c))]
        }
      }
    }
    for (const c of this.components) {
      const pinNames = {
        resistor: ["A", "B"],
        capacitor: ["A", "B"],
        led: ["+", "-"]
      }[c.type]
      const type =
        {
          resistor: "r_v",
          capacitor: "c_v",
          led: "d_led_v"
        }[c.type] || ""
      const connections = c.pins
        .map(p => ({
          [pinNames[p.name]]: [2 + this.nets.findIndex(n => n.includes(p))]
        }))
        .reduce((p, o) => Object.assign(p, o), {})
      const portDirections = c.pins
        .map(p => ({ [pinNames[p.name]]: p.direction }))
        .reduce((p, o) => Object.assign(p, o), {})
      cells[c.name] = {
        type,
        port_directions: portDirections,
        connections
      }
    }
    return {
      modules: {
        [this.name]: {
          ports,
          cells
        }
      }
    }
  }
  private _connect(one, two) {
    this._add(one)
    this._add(two)
    one.direction = "output"
    two.direction = "input"
    for (const net of this.nets) {
      if (net.includes(one) && net.includes(two)) {
        return
      } else if (net.includes(one)) {
        net.push(two)
        return
      } else if (net.includes(two)) {
        net.push(one)
        return
      }
    }
    this.nets.push([one, two])
  }
  private _add(x) {
    if (x instanceof Pin) {
      x = x.component
    }
    if (
      !this.components.includes(x) &&
      !this.labels.includes(x) &&
      !this.subcircuits.includes(x.circuit)
    ) {
      // add the component or its corresponding circuit if it's already in a
      // circuit
      if (x.circuit == null) {
        // we are adding a new label or component to this circuit
        while (x.name in this) {
          x.name = incrementRef(x.name)
        }
        x.circuit = this
        this[x.name] = x
        if (x instanceof Component) {
          this.components.push(x)
        } else if (x instanceof Label) {
          this.labels.push(x)
        }
      } else {
        // we are adding a new subcircuit
        while (x.circuit.name in this) {
          x.circuit.name = incrementRef(x.circuit.name)
        }
        this.subcircuits.push(x.circuit)
        this[x.circuit.name] = x.circuit
      }
    }
  }
}

function incrementRef(str) {
  const ns = str.split(/\D/)
  const lastN = ns[ns.length - 1]
  const n = parseInt(lastN, 10)
  if (isNaN(n)) {
    return str + "2"
  }
  return str.slice(0, str.lastIndexOf(lastN)) + String(n + 1)
}

export {
  Component,
  capacitor,
  resistor,
  led,
  npn,
  pnp,
  Circuit,
  Label,
  Power,
  Ground,
  Output,
  Input
}
