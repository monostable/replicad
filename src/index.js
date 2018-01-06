class Component {
  constructor(description) {
    this.value = description;
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

class Net {
  constructor() {}
}

function Nets(n) {
  return Array(n, null).map(() => new Net());
}

class Connection {
  constructor(one, two) {
    this[0] = one;
    this[1] = two;
  }
}

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
    console.log(one instanceof Component);
    this.connections.push(new Connection(one, two));
  }
}

module.exports = {Resistor, Circuit, Net, Nets};
