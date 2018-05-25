# replicad

_work in progress_

Design circuits using Javascript/Typescript.


## Goals

- Confirm [Atwood's Law](https://blog.codinghorror.com/the-principle-of-least-power/)
- Make it easier to design and reason about circuits
- Offer static analysis and DRC checks to make it hard to introduce errors into your circuit
- Encourage design re-use
- Provide an interactive editor and viewer wth a visual preview of your circuit

## Implementation

_work in progress_

- A transform to bind variable names as schematic references
- A library (in `./lib`) that provides classes for circuit description.
- Creating a circuit involves instantiating the `Circuit` class and then adding connections to it and exporting it.

## Example

```js
import {
  Capacitor,
  Resistor,
  Circuit,
  Input,
  Output,
  Ground
} from "../lib/index"

const r1 = new Resistor("1k")
const c1 = new Capacitor("1uF")

const vin = new Input()
const vout = new Output()
const gnd = new Ground()

const circuit = new Circuit()

circuit.chain(vin, r1, vout, r2, gnd)

export default circuit
```

Output:

![](examples/r_c.svg)


## Try it out


```
npm install
npx ./replicad examples/r_c.ts > out.svg
```

## Related Work

- [PHDL](https://sourceforge.net/p/phdl/wiki/Home/) - The PCB hardware description language, an HDL that can be used to generate Eagle, Orcad and other netlists.
- [SKiDL](http://xesscorp.github.io/skidl) - Extends Python with the ability to design electronic circuits.
- [pycircuit](https://github.com/dvc94ch/pycircuit) - Ditto, also does footprints, layout and routing. Has some cool experimental support for placement/layout/routing using SMT solvers and has it's own interactive viewer.
- [netlistsvg](https://github.com/nturley/ntelistsvg) - The schematic rendering library we will be using for our interactive editor.
