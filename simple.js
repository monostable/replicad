const Project = require('ts-simple-ast').default;
const ts = require('typescript');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const sourceFiles = project.getSourceFiles();

const f = project.getSourceFile('examples/r_c.ts');

const calls = f.getDescendantsOfKind(ts.SyntaxKind.CallExpression);

calls.forEach(call => {
  let e = call.getExpression();

  if (e.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
    e = e.getExpression();
    if (e.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
      console.log(e.getText())
      console.log(e.getType().getApparentType().getText())
      console.log(e.getName())
    } else {
      e = e.getType().getText()
    }

  }
});
