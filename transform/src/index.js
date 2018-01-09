const {types: t} = require('@babel/core');
const {default: template} = require('@babel/template');
const toAst = require('babel-literal-to-ast');

const ERROR = '__replicad__errors__';
const WARN = '__replicad__warnings__';

function incrementRef(str) {
  const ns = str.split(/\D/);
  const lastN = ns[ns.length - 1];
  const n = parseInt(lastN);
  if (isNaN(n)) {
    return str + '1';
  }
  return str.slice(0, str.lastIndexOf(lastN)) + String(n + 1);
}

module.exports = function() {
  const log = template('LOG.append(OBJ)');

  function error(path, message) {
    const obj = toAst({message, loc: path.node.loc});
    const ast = log({
      LOG: ERROR,
      OBJ: obj,
    });
    path.replaceWith(ast);
  }

  function warning(path, message) {
    const obj = toAst({message, loc: path.node.loc});
    const ast = log({
      LOG: WARN,
      OBJ: obj,
    });
    path.insertAfter(ast);
  }

  function addNetNames(path) {
    const callee = path.node.callee.name;
    if (callee === 'Nets') {
      if (path.node.arguments.length === 0) {
        if (path.parent.type !== 'VariableDeclarator') {
          error(path, "'Nets' called without being assigned to variables.");
          return;
        }
        if (path.parent.id.type === 'ArrayPattern') {
          const names = path.parent.id.elements.map(x => x.name);
          const a = t.arrayExpression(names.map(s => t.stringLiteral(s)));
          path.node.arguments = [a];
        } else {
          const parent = path.parentPath.parentPath;
          error(parent, "'Nets' called without array pattern.");
        }
      }
    } else if (callee === 'Net') {
      if (path.node.arguments.length === 0) {
        if (path.parent.type !== 'VariableDeclarator') {
          error(path, "'Net' called without being assigned to variable.");
          return;
        }
        const name = path.parent.id.name;
        path.node.arguments = [t.stringLiteral(name)];
      }
    }
  }

  function prependLog(path) {
    const errors = template.ast(`const ${ERROR} = []`);
    const warnings = template.ast(`const ${WARN} = []`);
    path.node.body.unshift(errors);
    path.node.body.unshift(warnings);
  }

  const visitor = {
    Program(path) {
      prependLog(path);
    },
    CallExpression(path) {
      addNetNames(path);
    },
  };

  return {
    visitor,
  };
};
