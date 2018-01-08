const __replicad__warnings__ = [];
const __replicad__errors__ = [];
let [vcc, vout, gnd] = Nets(["vcc", "vout", "gnd"]);

__replicad__errors__.append({
  "message": "'Nets' called without array pattern.",
  "loc": {
    "start": {
      "line": 2,
      "column": 0
    },
    "end": {
      "line": 2,
      "column": 18
    }
  }
});

let vcc3 = Net("vcc3");
