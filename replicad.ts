#!/usr/bin/env ts-node
// vim: filetype=typescript

import fs = require("fs")
import netlistsvg = require("netlistsvg")
import path = require("path")
import Project from "ts-simple-ast"
import * as ts from "typescript"

const inputPath = process.argv[2]

if (inputPath == null) {
  console.error("USAGE: replicad <input>.ts")
  process.exit(1)
}

const project = new Project()
project.addExistingSourceFiles(inputPath)
const sourceFiles = project.getSourceFiles()

addNames(sourceFiles)

const circuit = require("./" + inputPath.replace(/\.ts$/, ".js")).default
const netlist = circuit.toYosys()

const skinPath = path.join(__dirname, "node_modules/netlistsvg/lib/analog.svg")
fs.readFile(skinPath, (err, skinData) => {
  if (err) { throw err }
  netlistsvg.render(skinData, netlist, (err2, svgData) => {
    if (err2) { throw err2 }
    console.log(svgData)
  })
})

function addNames(files) {
  files.forEach(f => {
    const imports = f
      .getImportDeclarations()
      .map(i => i.getModuleSpecifierSourceFile())
    addNames(imports)

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
          const original = arg.getText()
          const v = getObjectVariableName(arg)
          arg.replaceWithText(`(${v}.name = '${v}', ${arg.getText()})`)
        })
      }
    })
    const emitResult = f.emit()
    for (const diagnostic of emitResult.getDiagnostics()) {
      console.error(diagnostic.getMessageText())
    }
  })
}

function getObjectVariableName(e) {
  const prev = [e]
  while (
    e.getKind() === ts.SyntaxKind.PropertyAccessExpression ||
    e.getKind() === ts.SyntaxKind.ElementAccessExpression
  ) {
    e = e.getExpression()
    prev.unshift(e)
  }
  // if our expression is not something that can be added to a circuit, roll
  // back to the last expression that was
  for (const prevExp of prev) {
    const base = getBaseName(prevExp)
    if (base === "Label" || base === "Component") {
      return prevExp.getText()
    }
  }
}

function getBaseName(e) {
  let t = e.getType()._compilerType
  let base = t.getBaseTypes()
  while (base != null && base.length > 0) {
    t = base[0]
    base = t.getBaseTypes()
  }
  return (t.symbol || {}).escapedName
}
