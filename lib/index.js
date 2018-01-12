class Pin {
  constructor(component, name) {
    this.name = name;
    this.component = component;
  }
}
Pin = bindNew(Pin);

class Component {
  constructor(description, name) {
    this.name = name;
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

class Resistor extends Component {
  constructor(description, name) {
    super('resistor ' + description, name);
  }
}

class Capacitor extends Component {
  constructor(description, name) {
    super('capacitor ' + description, name);
  }
}

Component = bindNew(Component);
Resistor = bindNew(Resistor);
Capacitor = bindNew(Capacitor);

class Net {
  constructor(name) {
    this.name = name;
  }
}

class Power extends Net {
  constructor(name) {
    super(name);
  }
}
class Ground extends Net {
  constructor(name) {
    super(name);
  }
}
class Input extends Net {
  constructor(name) {
    super(name);
  }
}
class Output extends Net {
  constructor(name) {
    super(name);
  }
}
Net = bindNew(Net);
Power = bindNew(Power);
Ground = bindNew(Ground);
Input = bindNew(Input);
Output = bindNew(Output);

function Nets(names) {
  return names.map(n => Net(n));
}

function pinOrNet(x) {
  return x instanceof Net || x instanceof Pin;
}

class Circuit {
  constructor(name) {
    this.components = [];
    this.references = [];
    this.nets = [];
    this.name = name;
  }
  connect_through() {
    Array.prototype.slice.call(arguments).forEach((c, i) => {
      if (i > 0) {
        this.connect(arguments[i - 1], c);
      }
    });
  }
  connect(one, two) {
    this._add_component(one);
    this._add_component(two);
    if (!pinOrNet(one)) {
      one = one.pins[1];
    }
    if (!pinOrNet(two)) {
      two = two.pins[0];
    }
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
  _add_component(c) {
    if (c instanceof Pin) {
      c = c.component;
    }
    if (!this.components.includes(c)) {
      while (this.references.includes(c.name)) {
        c.name = incrementRef(c.name);
      }
      this.references.push(c.name);
      this.components.push(c);
    }
  }
  toYosys() {
    const ports = {};
    const cells = {};
    for (const c of this.components) {
      if (c instanceof Net && c instanceof Power) {
        cells[c.name] = {
          type: 'vcc',
          port_directions: {
            A: 'output',
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))],
          },
        };
      } else if (c instanceof Net && c instanceof Ground) {
        cells[c.name] = {
          type: 'gnd',
          port_directions: {
            A: 'input',
          },
          connections: {
            A: [2 + this.nets.findIndex(n => n.includes(c))],
          },
        };
      } else if (c instanceof Net) {
        const direction =
          c instanceof Output
            ? 'input'
            : c instanceof Input
              ? 'output'
              : c.direction === 'output' ? 'input' : 'output';
        ports[c.name] = {
          direction: c.direction === 'output' ? 'input' : 'output',
          bits: [2 + this.nets.findIndex(n => n.includes(c))],
        };
      } else {
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
  _Class = (...args) => new Class(...args);
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
  Net,
  Nets,
  Power,
  Ground,
  Output,
  Input,
};
