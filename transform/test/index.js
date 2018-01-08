const pluginTester = require('babel-plugin-tester');
const replicadPlugin = require('../src');
const path = require('path');
pluginTester({
  plugin: replicadPlugin,
  pluginName: 'replicad',
  fixtures: path.join(__dirname, 'fixtures'),
});
