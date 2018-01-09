class Pin {
  constructor(component, name) {
    this.type = 'Pin';
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
    this.pin0 = this.pins[0];
    this.pin1 = this.pins[1];
  }
  copy() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    );
  }
  equals(other) {
    const sameCons = this.constructor === other.constructor;
    const sameValue = () => this.value === other.value;
    return sameCons && sameValue();
  }
}

class Resistor extends Component {
  constructor(description, name='R1') {
    super(description, name);
  }
}
Component = bindNew(Component);
Resistor = bindNew(Resistor);

class Net {
  constructor(name) {
    this.type = 'Net';
    this.name = name;
  }
}
Net = bindNew(Net);

function Nets(names) {
  return names.map(n => Net(n));
}

function pinOrNet(x) {
  return x instanceof Net || x instanceof Pin;
}

class Connection {
  constructor(one, two) {
    if (!pinOrNet(one)) {
      one = one.pins[0];
    }
    if (!pinOrNet(two)) {
      two = two.pins[0];
    }
    this[0] = one;
    this[1] = two;
  }
}
Connection = bindNew(Connection);

class Circuit {
  constructor() {
    this.connections = [];
    this.components = [];
    this.references = [];
  }
  connect() {
    Array.prototype.slice.call(arguments).forEach((x, i) => {
      if (i > 0) {
        this._connect_two(x, arguments[i - 1]);
      }
    });
  }
  _connect_two(one, two) {
    this._add_component(one);
    this._add_component(two);
    this.connections.push(Connection(one, two));
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

module.exports = {Resistor, Circuit, Net, Nets};
