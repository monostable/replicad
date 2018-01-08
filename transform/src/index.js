const {types: t} = require('@babel/core');
const {default: template} = require('@babel/template');

module.exports = function() {
  function error(path, message) {
    const obj = {message, loc: path.node.loc};
    path.replaceWith(
      template.ast(`__replicad__errors__.append(${JSON.stringify(obj)})`),
    );
  }

  function warning(path, message) {
    const obj = {message, loc: path.node.loc};
    path.insertAfter(
      template.ast(`__replicad__warnings__.append(${JSON.stringify(obj)})`),
    );
  }

  const AddVarNamesToNets = {
    CallExpression(path) {
      const callee = path.node.callee.name
      if (callee === 'Nets') {
        if (path.parent.id.type === 'ArrayPattern') {
          const names = path.parent.id.elements.map(x => x.name);
          const a = t.arrayExpression(names.map(s => t.stringLiteral(s)));
          path.node.arguments = [a];
        } else {
          const parent = path.parentPath.parentPath;
          error(parent, "'Nets' called without array pattern.");
        }
      } else if (callee === 'Net') {
        const name = path.parent.id.name;
        path.node.arguments = [t.stringLiteral(name)]
      }
    },
  };
  function prependLog(path) {
    const errors = template.ast('const __replicad__errors__ = []');
    const warnings = template.ast('const __replicad__warnings__ = []');
    path.node.body.unshift(errors);
    path.node.body.unshift(warnings);
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
