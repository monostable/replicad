const {types: t} = require('@babel/core');

module.exports = function() {
  const AddVarNamesToNets = {
    CallExpression(path) {
      if (path.node.callee.name === 'Nets') {
        if (path.parent.id.type === 'ArrayPattern') {
          const names = path.parent.id.elements.map(x => x.name);
          const a = t.arrayExpression(names.map(s => t.stringLiteral(s)));
          path.node.arguments = [a];
        }
      }
    },
  };
  const VariableVisitor = {
    VariableDeclaration(path) {
      path.traverse(AddVarNamesToNets);
    },
  };
  return {
    visitor: VariableVisitor,
  };
};
