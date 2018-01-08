const {types: t} = require('@babel/core');

module.exports = function() {
  function log(message) {
    const append = t.memberExpression(
      t.identifier('__replicad__log__'),
      t.identifier('append'),
    );
    const call = t.callExpression(append, [t.stringLiteral(message)]);
    return t.expressionStatement(call);
  }

  const AddVarNamesToNets = {
    CallExpression(path) {
      if (path.node.callee.name === 'Nets') {
        if (path.parent.id.type === 'ArrayPattern') {
          const names = path.parent.id.elements.map(x => x.name);
          const a = t.arrayExpression(names.map(s => t.stringLiteral(s)));
          path.node.arguments = [a];
        } else {
          path
            .parentPath
            .parentPath
            .replaceWith(log("'Nets' called without array pattern."));
        }
      } else if (path.node.callee.name === 'Net') {
        console.log(path.parent.id.type);
      }
    },
  };
  function prependLog(path) {
    const log = t.variableDeclaration('const', [
      t.variableDeclarator(
        t.identifier('__replicad__log__'),
        t.arrayExpression(),
      ),
    ]);
    path.node.body.unshift(log);
  }
  const visitor = {
    VariableDeclaration(path) {
      path.traverse(AddVarNamesToNets);
    },
    Program(path) {
      prependLog(path);
    },
  };
  return {
    visitor,
  };
};
