const pluginTester = require('babel-plugin-tester');
const replicadPlugin = require('../src');
const path = require('path');
pluginTester({
  plugin: replicadPlugin,
  pluginName: 'replicad',
  fixtures: path.join(__dirname, 'fixtures'),
  tests: [
    {
      title: 'add net names into Net() and Nets()',
      code: `
        let [vcc, vout, gnd] = Nets()
        let vout2 = Net()
      `,
      snapshot: true,
    },
    {
      title: 'adds errors and warnings when used incorrectly',
      code: `
        let mistake1 = Nets()
        let mistake2 = Net("mistake")
        let mistake3 = Nets("mistake")
      `,
      snapshot: true,
    },
    {
      title: 'bare Net and Nets cause errors',
      code: `
        Net()
        Nets()
      `,
      snapshot: true,
    },
  ],
});
