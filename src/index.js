class Pin {
  constructor(n) {
    this.type = 'Pin';
    this.name = n;
  }
}

class Component {
  constructor(description) {
    this.value = description;
    this.pins = [new Pin(0), new Pin(1)];
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
  constructor(description) {
    super(description);
  }
}
Resistor = bindNew(Resistor);

class Net {
  constructor() {
    this.type = 'Net';
  }
}

function Nets(n) {
  return Array(n, null).map(() => new Net());
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
  }
  connect() {
    Array.prototype.slice.call(arguments).forEach((x, i) => {
      if (i > 0) {
        this._connect_two(x, arguments[i - 1]);
      }
    });
  }
  _connect_two(one, two) {
    this.connections.push(Connection(one, two));
  }
}
Circuit = bindNew(Circuit);

function bindNew(cls) {
  return (...args) => new cls(...args);
}

module.exports = {Resistor, Circuit, Net, Nets};
