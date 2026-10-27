/* ------------------------------------------------------------
Checks and formats authored source for explicit control flow and readable spacing.
---------------------------------------------------------------*/

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { check, format, resolveConfig } from 'prettier'
import { parsers } from 'prettier/plugins/babel'

const projectDirectory = dirname(dirname(fileURLToPath(import.meta.url)))
const shouldFix = process.argv.includes('--fix')
const sourceDirectories = ['app', 'lib', 'redux', 'scripts', 'tests']
const rootSourceFiles = ['next.config.ts', 'proxy.ts']

const controlFlowTypes = new Set([
  'IfStatement',
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
  'SwitchStatement',
  'TryStatement'
])

const exitStatementTypes = new Set(['ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement'])
const loopTypes = new Set(['ForStatement', 'ForInStatement', 'ForOfStatement', 'WhileStatement', 'DoWhileStatement'])

// Collects authored code while excluding dependencies, generated declarations and the reference project.
const collectSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const filenames = []

  for (const entry of entries) {
    const filename = join(directory, entry.name)

    if (entry.isDirectory()) {
      filenames.push(...(await collectSourceFiles(filename)))
    } else if (/\.(?:ts|tsx|js|mjs)$/.test(entry.name) && !entry.name.endsWith('.d.ts')) {
      filenames.push(filename)
    }
  }

  return filenames
}

// Walks syntax nodes without interpreting or executing application code.
const visitSyntax = (node, visitor) => {
  if (!node || typeof node !== 'object') {
    return
  }

  if (typeof node.type === 'string') {
    visitor(node)
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child === 'object' && typeof child.type === 'string') {
          visitSyntax(child, visitor)
        }
      }
    } else if (value && typeof value === 'object' && typeof value.type === 'string') {
      visitSyntax(value, visitor)
    }
  }
}

// Applies insertions from right to left so syntax positions remain valid throughout the pass.
const applyInsertions = (source, insertions) => {
  let result = source

  const sortedInsertions = [...insertions].sort(
    (firstInsertion, secondInsertion) => secondInsertion.offset - firstInsertion.offset
  )

  for (const insertion of sortedInsertions) {
    result = result.slice(0, insertion.offset) + insertion.text + result.slice(insertion.offset)
  }

  return result
}

// Wraps every conditional branch and loop body, including one-line redirect and error guards.
const collectBraceProblems = (syntax) => {
  const problems = []

  // Records a missing block while preserving the original statement and its semantics.
  const inspectBody = (body) => {
    if (!body || body.type === 'BlockStatement') {
      return
    }

    problems.push({
      message: 'Use braces around every conditional branch and loop body.',
      line: body.loc.start.line,
      insertions: [
        { offset: body.start, text: '{\n' },
        { offset: body.end, text: '\n}' }
      ]
    })
  }

  visitSyntax(syntax, (node) => {
    if (node.type === 'IfStatement') {
      inspectBody(node.consequent)

      if (node.alternate && node.alternate.type !== 'IfStatement') {
        inspectBody(node.alternate)
      }
    } else if (loopTypes.has(node.type)) {
      inspectBody(node.body)
    }
  })

  return problems
}

// Includes a statement's explanation when deciding where its preceding blank line belongs.
const getStatementStart = (statement, previousStatement, comments) => {
  const leadingComment = comments.find(
    (comment) =>
      comment.start >= previousStatement.end &&
      comment.end <= statement.start &&
      comment.loc.start.line > previousStatement.loc.end.line
  )

  return leadingComment || statement
}

// Checks logical statement boundaries and the repository's multiline JSX sibling rule.
const collectSpacingProblems = (syntax, source) => {
  const problems = []
  const recordedOffsets = new Set()

  // Adds one whitespace-only correction per boundary even when several readability rules apply.
  const requireBlankLine = (previousNode, currentNode, message) => {
    const boundary = getStatementStart(currentNode, previousNode, syntax.comments || [])
    const between = source.slice(previousNode.end, boundary.start)
    const hasBlankLine = /\n[ \t]*\n/.test(between)

    if (hasBlankLine || recordedOffsets.has(boundary.start)) {
      return
    }

    const lineStart = source.lastIndexOf('\n', boundary.start - 1) + 1
    recordedOffsets.add(boundary.start)
    problems.push({ message, line: boundary.loc.start.line, insertions: [{ offset: lineStart, text: '\n' }] })
  }

  visitSyntax(syntax, (node) => {
    if (node.type === 'Program' || node.type === 'BlockStatement') {
      for (let index = 1; index < node.body.length; index += 1) {
        const previousStatement = node.body[index - 1]
        const currentStatement = node.body[index]
        const previousType = previousStatement.type
        const currentType = currentStatement.type
        const bothImports = previousType === 'ImportDeclaration' && currentType === 'ImportDeclaration'

        const hasControlBoundary =
          controlFlowTypes.has(previousType) || controlFlowTypes.has(currentType) || exitStatementTypes.has(currentType)

        const hasMultilineBoundary =
          previousStatement.loc.end.line > previousStatement.loc.start.line ||
          currentStatement.loc.end.line > currentStatement.loc.start.line

        if (!bothImports && (hasControlBoundary || hasMultilineBoundary)) {
          requireBlankLine(
            previousStatement,
            currentStatement,
            'Separate control flow and multiline logical steps with a blank line.'
          )
        }
      }
    }

    if (node.type === 'JSXElement' || node.type === 'JSXFragment') {
      const children = node.children.filter((child) => child.type !== 'JSXText' || child.value.trim())

      for (let index = 1; index < children.length; index += 1) {
        const previousChild = children[index - 1]
        const currentChild = children[index]

        if (previousChild.type === 'JSXText' || currentChild.type === 'JSXText') {
          continue
        }

        const hasMultilineSibling =
          previousChild.loc.end.line > previousChild.loc.start.line ||
          currentChild.loc.end.line > currentChild.loc.start.line

        if (hasMultilineSibling) {
          requireBlankLine(previousChild, currentChild, 'Separate multiline JSX siblings with a blank line.')
        }
      }
    }
  })

  return problems
}

// Runs the checks in a stable order and formats only when explicitly requested.
const inspectFile = async (filename) => {
  let source = await readFile(filename, 'utf8')
  const options = { ...(await resolveConfig(filename)), filepath: filename }
  const initialSyntax = parsers['babel-ts'].parse(source)
  const braceProblems = collectBraceProblems(initialSyntax)

  if (shouldFix) {
    source = applyInsertions(
      source,
      braceProblems.flatMap((problem) => problem.insertions)
    )

    source = await format(source, options)
  }

  const formattedSyntax = parsers['babel-ts'].parse(source)
  const spacingProblems = collectSpacingProblems(formattedSyntax, source)

  if (shouldFix) {
    source = applyInsertions(
      source,
      spacingProblems.flatMap((problem) => problem.insertions)
    )

    source = await format(source, options)
    await writeFile(filename, source)

    return []
  }

  const problems = [...braceProblems, ...spacingProblems]

  if (!(await check(source, options))) {
    problems.push({ line: 1, message: 'Apply the shared formatter with npm run format.' })
  }

  return problems.map((problem) => `${relative(projectDirectory, filename)}:${problem.line} ${problem.message}`)
}

// Reports every source violation in one run so fixes do not depend on repeated trial and error.
const main = async () => {
  const filenames = rootSourceFiles.map((filename) => join(projectDirectory, filename))

  for (const directory of sourceDirectories) {
    filenames.push(...(await collectSourceFiles(join(projectDirectory, directory))))
  }

  const problems = []

  for (const filename of filenames.sort()) {
    problems.push(...(await inspectFile(filename)))
  }

  if (problems.length > 0) {
    console.error(problems.join('\n'))
    process.exitCode = 1

    return
  }

  console.info(`${shouldFix ? 'Formatted' : 'Checked'} ${filenames.length} authored source files.`)
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Code-style checking failed.')
  process.exitCode = 1
})
