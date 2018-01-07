const babylon = require('babylon');
const fs = require('fs');
const {default: traverse} = require('babel-traverse');

const example = fs.readFileSync('examples/resistor_divider.js', 'utf8');

const ast = babylon.parse(example);

const CallVisitor = {
  CallExpression(path) {
    const name = path.node.callee.name;
    if (name === 'Nets') {
      if (path.parent.id.type === 'ArrayPattern') {
        const names = path.parent.id.elements.map(x => x.name)
        console.log(names)
      }
    }

  },
};
const VariableVisitor = {
  VariableDeclaration(path) {
    path.traverse(CallVisitor);
  },
};

traverse(ast, VariableVisitor);
