const pluginTester = require('babel-plugin-tester');
const replicadPlugin = require('../src');
const path = require('path');
pluginTester({
  plugin: replicadPlugin,
  pluginName: 'replicad',
  fixtures: path.join(__dirname, 'fixtures'),
  tests: [
    {
      title: 'add label names into Label() and Labels()',
      code: `
        let [vcc, vout, gnd] = Labels()
        let vout2 = Label()
      `,
      snapshot: true,
    },
    {
      title: 'adds errors and warnings when used incorrectly',
      code: `
        let mistake1 = Labels()
      `,
      snapshot: true,
    },
    {
      title: 'bare Label and Labels cause errors',
      code: `
        Label()
        Labels()
      `,
      snapshot: true,
    },
  ],
});
