"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Pin = /** @class */ (function () {
    function Pin(component, name) {
        this.name = name;
        this.component = component;
    }
    return Pin;
}());
var Component = /** @class */ (function () {
    function Component(description) {
        this.value = description;
        this.pins = [new Pin(this, 0), new Pin(this, 1)];
        this.pin1 = this.pins[0];
        this.pin2 = this.pins[1];
        this.copy = this.copy.bind(this);
        this.equals = this.equals.bind(this);
    }
    Component.prototype.copy = function () {
        return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
    };
    Component.prototype.equals = function (other) {
        var sameValue = this.value === other.value;
        return sameValue;
    };
    return Component;
}());
var Resistor = /** @class */ (function (_super) {
    __extends(Resistor, _super);
    function Resistor(description) {
        return _super.call(this, 'resistor ' + description) || this;
    }
    return Resistor;
}(Component));
exports.Resistor = Resistor;
var Capacitor = /** @class */ (function (_super) {
    __extends(Capacitor, _super);
    function Capacitor(description) {
        return _super.call(this, 'capacitor ' + description) || this;
    }
    return Capacitor;
}(Component));
exports.Capacitor = Capacitor;
var Label = /** @class */ (function () {
    function Label() {
    }
    return Label;
}());
exports.Label = Label;
var Power = /** @class */ (function (_super) {
    __extends(Power, _super);
    function Power() {
        return _super.call(this) || this;
    }
    return Power;
}(Label));
exports.Power = Power;
var Ground = /** @class */ (function (_super) {
    __extends(Ground, _super);
    function Ground() {
        return _super.call(this) || this;
    }
    return Ground;
}(Label));
exports.Ground = Ground;
var Input = /** @class */ (function (_super) {
    __extends(Input, _super);
    function Input() {
        return _super.call(this) || this;
    }
    return Input;
}(Label));
exports.Input = Input;
var Output = /** @class */ (function (_super) {
    __extends(Output, _super);
    function Output() {
        return _super.call(this) || this;
    }
    return Output;
}(Label));
exports.Output = Output;
function pinOrLabel(x) {
    return x instanceof Label || x instanceof Pin;
}
var Circuit = /** @class */ (function () {
    function Circuit() {
        this.components = [];
        this.labels = [];
        this.subcircuits = [];
        this.nets = [];
        this.chain = this.chain.bind(this);
        this.connect = this.connect.bind(this);
        this._connect = this._connect.bind(this);
        this._add = this._add.bind(this);
        this.toYosys = this.toYosys.bind(this);
    }
    Circuit.prototype.chain = function (elements) {
        var _this = this;
        elements.forEach(function (two, i) {
            if (i > 0) {
                var one = elements[i - 1];
                _this._add(one);
                _this._add(two);
                // out of the first and into the second
                if (!pinOrLabel(one)) {
                    one = one.pins[1];
                }
                if (!pinOrLabel(two)) {
                    two = two.pins[0];
                }
                _this._connect(one, two);
            }
        });
    };
    Circuit.prototype.connect = function (elements) {
        var _this = this;
        elements.forEach(function (two, i) {
            if (i > 0) {
                var one = elements[i - 1];
                // connect the tops of both
                if (!pinOrLabel(one)) {
                    one = one.pins[0];
                }
                if (!pinOrLabel(two)) {
                    two = two.pins[0];
                }
                _this._connect(one, two);
            }
        });
    };
    Circuit.prototype._connect = function (one, two) {
        this._add(one);
        this._add(two);
        one.direction = 'output';
        two.direction = 'input';
        for (var _i = 0, _a = this.nets; _i < _a.length; _i++) {
            var net = _a[_i];
            if (net.includes(one) && net.includes(two)) {
                return;
            }
            else if (net.includes(one)) {
                net.push(two);
                return;
            }
            else if (net.includes(two)) {
                net.push(one);
                return;
            }
        }
        this.nets.push([one, two]);
    };
    Circuit.prototype._add = function (x) {
        if (x instanceof Pin) {
            x = x.component;
        }
        if (!this.components.includes(x) &&
            !this.labels.includes(x) &&
            !this.subcircuits.includes(x.circuit)) {
            // add the component or its corresponding circuit if it's already in a
            // circuit
            if (x.circuit == null) {
                // we are adding a new label or component to this circuit
                while (x.name in this) {
                    x.name = incrementRef(x.name);
                }
                x.circuit = this;
                this[x.name] = x;
                if (x instanceof Component) {
                    this.components.push(x);
                }
                else if (x instanceof Label) {
                    this.labels.push(x);
                }
            }
            else {
                // we are adding a new subcircuit
                while (x.circuit.name in this) {
                    x.circuit.name = incrementRef(x.circuit.name);
                }
                this.subcircuits.push(x.circuit);
                this[x.circuit.name] = x.circuit;
            }
        }
    };
    Circuit.prototype.toYosys = function () {
        var _this = this;
        var ports = {};
        var cells = {};
        var _loop_1 = function (c) {
            if (c instanceof Power) {
                cells[c.name] = {
                    type: 'vcc',
                    port_directions: {
                        A: 'output'
                    },
                    connections: {
                        A: [2 + this_1.nets.findIndex(function (n) { return n.includes(c); })]
                    }
                };
            }
            else if (c instanceof Ground) {
                cells[c.name] = {
                    type: 'gnd',
                    port_directions: {
                        A: 'input'
                    },
                    connections: {
                        A: [2 + this_1.nets.findIndex(function (n) { return n.includes(c); })]
                    }
                };
            }
            else {
                var direction = c instanceof Output
                    ? 'output'
                    : c instanceof Input ? 'input' : c.direction;
                ports[c.name] = {
                    direction: direction,
                    bits: [2 + this_1.nets.findIndex(function (n) { return n.includes(c); })]
                };
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.labels; _i < _a.length; _i++) {
            var c = _a[_i];
            _loop_1(c);
        }
        var _loop_2 = function (c) {
            var pinNames = ['A', 'B'];
            var types = { Resistor: 'r_v', Capacitor: 'c_v' };
            var connections = c.pins
                .map(function (p) {
                return (_a = {},
                    _a[pinNames[p.name]] = [2 + _this.nets.findIndex(function (n) { return n.includes(p); })],
                    _a);
                var _a;
            })
                .reduce(function (p, o) { return Object.assign(p, o); }, {});
            var port_directions = c.pins
                .map(function (p) {
                return (_a = {}, _a[pinNames[p.name]] = p.direction, _a);
                var _a;
            })
                .reduce(function (p, o) { return Object.assign(p, o); }, {});
            cells[c.name] = {
                type: types[c.constructor.name],
                port_directions: port_directions,
                connections: connections
            };
        };
        for (var _b = 0, _c = this.components; _b < _c.length; _b++) {
            var c = _c[_b];
            _loop_2(c);
        }
        return {
            modules: (_d = {},
                _d[this.name] = {
                    ports: ports,
                    cells: cells
                },
                _d)
        };
        var _d;
    };
    return Circuit;
}());
exports.Circuit = Circuit;
function incrementRef(str) {
    var ns = str.split(/\D/);
    var lastN = ns[ns.length - 1];
    var n = parseInt(lastN);
    if (isNaN(n)) {
        return str + '2';
    }
    return str.slice(0, str.lastIndexOf(lastN)) + String(n + 1);
}
