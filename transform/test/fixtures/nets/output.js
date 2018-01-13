const __replicad__warnings__ = [];
const __replicad__errors__ = [];
let [vcc, vout, gnd] = Labels(["vcc", "vout", "gnd"]);

__replicad__errors__.append({
  "message": "'Labels' called without array pattern.",
  "loc": {
    "start": {
      "line": 2,
      "column": 0
    },
    "end": {
      "line": 2,
      "column": 20
    }
  }
});

let vcc3 = Label("vcc3");
