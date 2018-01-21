class Pin {
  constructor(component, name) {
    this.name = name
    this.component = component;
  }
}
Pin = bindNew(Pin);

class Component {
  constructor(description) {
    this.value = description;
    this.pins = [Pin(this, 0), Pin(this, 1)];
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
Component = bindNew(Component);

class Resistor extends Component {
  constructor(description) {
    super('resistor ' + description);
  }
}
Resistor = bindNew(Resistor);

class Capacitor extends Component {
  constructor(description) {
    super('capacitor ' + description);
  }
}
Capacitor = bindNew(Capacitor);

class Label {
  constructor() {
  }
}
Label = bindNew(Label);

class Power extends Label {
  constructor() {
    super();
  }
}
Power = bindNew(Power);

class Ground extends Label {
  constructor() {
    super();
  }
}
Ground = bindNew(Ground);

class Input extends Label {
  constructor() {
    super();
  }
}
Input = bindNew(Input);

class Output extends Label {
  constructor() {
    super();
  }
}
Output = bindNew(Output);

function pinOrLabel(x) {
  return x instanceof Label || x instanceof Pin;
}

class Circuit {
  constructor() {
    this.components = [];
    this.labels = [];
    this.subcircuits = [];
    this.nets = [];
  }
  chain(elements) {
    elements.forEach((two, i) => {
      if (i > 0) {
        let one = elements[i - 1];
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
  connect(elements) {
    elements.forEach((two, i) => {
      if (i > 0) {
        let one = elements[i - 1];
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
    console.log(c)
    if (c instanceof Pin) {
      c = c.component;
    }
    if (
      !this.components.concat(this.labels).includes(c) &&
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
Circuit = bindNew(Circuit);

function bindNew(Class) {
  function _Class() {
    for (
      var len = arguments.length, rest = Array(len), key = 0;
      key < len;
      key++
    ) {
      rest[key] = arguments[key];
    }

    return new (Function.prototype.bind.apply(Class, [null].concat(rest)))();
  }
  _Class.prototype = Class.prototype;
  return _Class;
}

function incrementRef(str) {
  const ns = str.split(/\D/);
  const lastN = ns[ns.length - 1];
  const n = parseInt(lastN);
  if (isNaN(n)) {
    return str + '2';
  }
  return str.slice(0, str.lastIndexOf(lastN)) + String(n + 1);
}

module.exports = {
  Capacitor,
  Resistor,
  Circuit,
  Label,
  Power,
  Ground,
  Output,
  Input,
};
