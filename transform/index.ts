import * as ts from 'typescript';

export interface MyPluginOptions {
  some?: string;
}

export default function myTransformerPlugin(
  program: ts.TypeChecker,
  opts?: MyPluginOptions,
) {
  return (ctx: ts.TransformationContext) => {
    return (sourceFile: ts.SourceFile) => {
      if (/r_c\.ts/.test(sourceFile.path)) {
        function visitor(node: ts.Node): ts.Node {
          if (node.escapedText === 'r1') {
            const type = program.getTypeChecker().getTypeAtLocation(node.name)
            console.log(type);
          }
          //if (
          //  ts.isCallExpression(node) &&
          //  node.expression.getText() === 'safely'
          //) {
          //  const target = node.arguments[0];
          //  if (ts.isPropertyAccessExpression(target)) {
          //    return ts.createBinary(
          //      target.expression,
          //      ts.SyntaxKind.AmpersandAmpersandToken,
          //      target,
          //    );
          //  }
          //}
          return ts.visitEachChild(node, visitor, ctx);
        }
        return ts.visitEachChild(sourceFile, visitor, ctx);
      } else {
        return sourceFile;
      }
    };
  };
}
