const pluginTester = require('babel-plugin-tester');
const replicadPlugin = require('../src');
const path = require('path');
pluginTester({
  plugin: replicadPlugin,
  pluginName: 'replicad',
  fixtures: path.join(__dirname, 'fixtures'),
  tests: [
    {
      code: `
        let [vcc, vout, gnd] = Nets()
        let r1 = Resistor()
        let r2 = r1.copy()

        let vcc2 = Net()

        let mistake = Nets()

        let circuit = Circuit()
        circuit.connect(vcc, r1)
      `,
      snapshot: true,
    },
  ],
});
