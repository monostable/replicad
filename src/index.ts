class Pin {
  name: string;
  component: Component;
  direction: string;
  constructor(name, component) {
    if (!(this instanceof Pin)) {
      return new Pin(name, Component);
    }
    this.name = name;
    this.component = component;
  }
}

class Component {
  name: string;
  pins: Array<Pin>;
  pin1: Pin;
  pin2: Pin;
  value: string;
  constructor(name, description) {
    this.name = name;
    this.value = description;
    this.pins = [new Pin(0, this), new Pin(1, this)];
    this.pin1 = this.pins[0];
    this.pin2 = this.pins[1];
  }
  copy() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    );
  }
  equals(other) {
    const sameValue = this.value === other.value;
    return sameValue;
  }
}

class Resistor extends Component {
  constructor(name, description) {
    super(name, 'resistor ' + description);
  }
}

class Capacitor extends Component {
  constructor(name, description) {
    super(name, 'capacitor ' + description);
  }
}

class Label {
  name: string;
  direction: string;
  constructor(name) {
    this.name = name;
  }
}

class Power extends Label {
  constructor(name) {
    super(name);
  }
}

class Ground extends Label {
  constructor(name) {
    super(name);
  }
}

class Input extends Label {
  constructor(name) {
    super(name);
  }
}

class Output extends Label {
  constructor(name) {
    super(name);
  }
}

function Labels(names: Array<string>): Array<Label> {
  return names.map(n => new Label(n));
}

function pinOrLabel(x: any): boolean {
  return x instanceof Label || x instanceof Pin;
}

class Circuit {
  name: string;
  components: Array<Component>;
  labels: Array<Label>;
  nets: Array<Array<Pin | Label>>;
  subcircuits: Array<Circuit>
  constructor(name) {
    this.name = name;
    this.components = [];
    this.labels = [];
    this.subcircuits = [];
    this.nets = [];
  }
  chain() {
    const args = arguments;
    Array.prototype.slice.call(arguments).forEach((two, i) => {
      if (i > 0) {
        let one = args[i - 1];
        this._add(one);
        this._add(two);
        // out of the first and into the second
        if (!pinOrLabel(one)) {
          one = one.pins[1];
        }
        if (!pinOrLabel(two)) {
          two = two.pins[0];
        }
        this._connect(one, two);
      }
    });
  }
  connect() {
    const args = arguments;
    Array.prototype.slice.call(arguments).forEach((two, i) => {
      if (i > 0) {
        let one = args[i - 1];
        // connect the tops of both
        if (!pinOrLabel(one)) {
          one = one.pins[0];
        }
        if (!pinOrLabel(two)) {
          two = two.pins[0];
        }
        this._connect(one, two);
      }
    });
  }
  _connect(one, two) {
    this._add(one);
    this._add(two);
    one.direction = 'output';
    two.direction = 'input';
    for (const net of this.nets) {
      if (net.includes(one) && net.includes(two)) {
        return;
      } else if (net.includes(one)) {
        net.push(two);
        return;
      } else if (net.includes(two)) {
        net.push(one);
        return;
      }
    }
    this.nets.push([one, two]);
  }
  _add(c) {
    if (c instanceof Pin) {
      c = c.component;
    }
    if (
      !this.labels.includes(c) &&
      !this.components.includes(c) &&
      !this.subcircuits.includes(c.circuit)
    ) {
      // add the component or its corresponding circuit if it's already in a
      // circuit
      if (c.circuit == null) {
        // we are adding a new label or component to this circuit
        while (c.name in this) {
          c.name = incrementRef(c.name);
        }
        c.circuit = this;
        this[c.name] = c;
        if (c instanceof Component) {
          this.components.push(c);
        } else if (c instanceof Label) {
          this.labels.push(c);
        }
      } else {
        // we are adding a new subcircuit
        while (c.circuit.name in this) {
          c.circuit.name = incrementRef(c.circuit.name);
        }
        this.subcircuits.push(c.circuit);
        this[c.circuit.name] = c.circuit;
      }
    }
  }
  toYosys() {
    const ports = {};
    const cells = {};
    for (const c of this.labels) {
      if (c instanceof Power) {
        cells[c.name] = {
          type: 'vcc',
          port_directions: {
            A: 'output',
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))],
          },
        };
      } else if (c instanceof Ground) {
        cells[c.name] = {
          type: 'gnd',
          port_directions: {
            A: 'input',
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))],
          },
        };
      } else {
        const direction =
          c instanceof Output
            ? 'output'
            : c instanceof Input ? 'input' : c.direction;
        ports[c.name] = {
          direction,
          bits: [2 + this.nets.findIndex(n => n.includes(c))],
        };
      }
    }
    for (const c of this.components) {
      const pinNames = ['A', 'B'];
      const types = {Resistor: 'r_v', Capacitor: 'c_v'};
      const connections = c.pins
        .map(p => ({
          [pinNames[p.name]]: [2 + this.nets.findIndex(n => n.includes(p))],
        }))
        .reduce((p, o) => Object.assign(p, o), {});
      const port_directions = c.pins
        .map(p => ({[pinNames[p.name]]: p.direction}))
        .reduce((p, o) => Object.assign(p, o), {});
      cells[c.name] = {
        type: types[c.constructor.name],
        port_directions,
        connections,
      };
    }
    return {
      modules: {
        [this.name]: {
          ports,
          cells,
        },
      },
    };
  }
}

function incrementRef(str: string): string {
  const ns = str.split(/\D/);
  const lastN = ns[ns.length - 1];
  const n = parseInt(lastN);
  if (isNaN(n)) {
    return str + '2';
  }
  return str.slice(0, str.lastIndexOf(lastN)) + String(n + 1);
}

export {
  Capacitor,
  Resistor,
  Circuit,
  Label,
  Labels,
  Power,
  Ground,
  Output,
  Input,
};
