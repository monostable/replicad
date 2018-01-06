class Resistor {
  constructor(description) {
    this.copy.bind(this);
    this.equals.bind(this);
    this.value = description;
  }
  copy() {
    return Object.create(
      Object.getPrototypeOf(this),
      Object.getOwnPropertyDescriptors(this),
    );
  }
  equals(other) {
    const sameCons = this.constructor === other.constructor
    const sameValue = () => this.value === other.value;
    return sameCons && sameValue()
  }
}

module.exports = {Resistor};
