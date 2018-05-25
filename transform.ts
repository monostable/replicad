const Project = require("ts-simple-ast").default
const ts = require("typescript")

const project = new Project({
  tsConfigFilePath: "tsconfig.json"
})

const sourceFiles = project.getSourceFiles()

sourceFiles.forEach(f => {
  const calls = f.getDescendantsOfKind(ts.SyntaxKind.CallExpression)

  calls.forEach(call => {
    const e = call.getExpression()
    if (
      e.getKind() === ts.SyntaxKind.PropertyAccessExpression &&
      (e.getName() === "connect" || e.getName() === "chain") &&
      e
        .getExpression()
        .getType()
        .getText() === "Circuit"
    ) {
      call.getArguments().forEach(arg => {
        let original = arg.getText()
        let v = original
        if (arg.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
          v = getObjectVariableName(e)
        }
        arg.replaceWithText(`(${v}.name = '${v}', ${arg.getText()})`)
      })
    }
  })
})

const emitResult = project.emit()
for (const diagnostic of emitResult.getDiagnostics()) {
  console.error(diagnostic.getMessageText())
}

function getObjectVariableName(e) {
  while (e.getKind() === ts.SyntaxKind.PropertyAccessExpression) {
    e = e.getExpression()
  }
  return e.getText()
}
