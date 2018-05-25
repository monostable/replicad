"use strict";
exports.__esModule = true;
var index_1 = require("../lib/index");
var r1 = new index_1.Resistor('1k');
var c1 = new index_1.Capacitor('1uF');
var vin = new index_1.Input();
var vout = new index_1.Output();
var gnd = new index_1.Ground();
var x = { circuit: null };
x.circuit = new index_1.Circuit();
x.circuit.connect([((vin.name = 'vin'), vin), ((r1.name = 'r1'), r1)]);
x.circuit.connect([
    ((r1.name = 'r1'), r1.pin2),
    ((vout.name = 'vout'), vout),
    ((c1.name = 'c1'), c1),
]);
x.circuit.connect([((c1.name = 'c1'), c1.pin2), ((gnd.name = 'gnd'), gnd)]);
console.log(JSON.stringify(x.circuit.toYosys(), null, 2));
