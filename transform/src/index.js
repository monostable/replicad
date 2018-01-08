const {types: t} = require('@babel/core');
const {default: template} = require('@babel/template');

module.exports = function() {
  function log(message) {
    return template.ast(`__replicad__log__.append("${message}")`);
  }

  const AddVarNamesToNets = {
    CallExpression(path) {
      if (path.node.callee.name === 'Nets') {
        if (path.parent.id.type === 'ArrayPattern') {
          const names = path.parent.id.elements.map(x => x.name);
          const a = t.arrayExpression(names.map(s => t.stringLiteral(s)));
          path.node.arguments = [a];
        } else {
          path.parentPath.parentPath.replaceWith(
            log("'Nets' called without array pattern."),
          );
        }
      } else if (path.node.callee.name === 'Net') {
        console.log(path.parent.id.type);
      }
    },
  };
  function prependLog(path) {
    const log = template.ast('const __replicad__log__ = []');
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
