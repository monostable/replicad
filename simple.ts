const Project = require('ts-simple-ast').default;
const ts = require('typescript');

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const sourceFiles = project.getSourceFiles();

const f = project.getSourceFile('examples/r_c.ts');

const calls = f.getDescendantsOfKind(ts.SyntaxKind.CallExpression);

calls.forEach(call => {
  const e = call.getExpression();
  if (
    e.getKind() === ts.SyntaxKind.PropertyAccessExpression &&
    e.getName() === 'connect' &&
    e
      .getExpression()
      .getType()
      .getText() === 'Circuit'
  ) {
    call.getArguments().forEach(arg => {
      let original = arg.getText();
      let v = original;
      //if it's an object prop get the object name
      if (arg.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
        let e = arg.getExpression();
        while (e.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
          e = e.getExpression();
        }
        v = e.getText();
      }
      arg.replaceWithText(`(${v}.name = '${v}', ${arg.getText()})`);
    });
  }
});

f.copyImmediately('out.ts', {overwrite: true});
