import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

// Evaluate content modules and their local imports, then compare every public leaf.
// Imported dictionaries are checked through their parent to avoid double counting.
const contentRoot = path.resolve('src/content')
const files = fs.readdirSync(contentRoot).filter((file) => file.endsWith('.ts'))
const modules = new Map()
const imported = new Set()
const evaluating = new Set()
function evaluate(file) {
  const filename = path.resolve(file)
  if (modules.has(filename)) return modules.get(filename)
  if (evaluating.has(filename))
    throw new Error(`Circular content import: ${filename}`)
  evaluating.add(filename)
  const source = fs.readFileSync(filename, 'utf8')
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  })
  const sandbox = {
    exports: {},
    require(specifier) {
      if (!specifier.startsWith('.'))
        throw new Error(`Non-local content import: ${specifier}`)
      const dependency = path.resolve(path.dirname(filename), `${specifier}.ts`)
      if (!dependency.startsWith(contentRoot + path.sep))
        throw new Error(
          `Content import outside dictionary folder: ${specifier}`,
        )
      imported.add(dependency)
      return evaluate(dependency)
    },
  }
  vm.runInNewContext(result.outputText, sandbox, { timeout: 1000, filename })
  evaluating.delete(filename)
  modules.set(filename, sandbox.exports)
  return sandbox.exports
}
for (const file of files) evaluate(path.join(contentRoot, file))
const flatten = (value, prefix = '') => {
  if (typeof value === 'string') {
    if (!value.trim()) throw new Error(`Empty translation: ${prefix}`)
    return [prefix]
  }
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error(`Invalid dictionary: ${prefix}`)
  return Object.entries(value).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  )
}
let count = 0
for (const file of files) {
  const filename = path.join(contentRoot, file)
  if (imported.has(filename)) continue
  for (const [name, dictionary] of Object.entries(modules.get(filename))) {
    const zh = flatten(dictionary.zh).sort()
    const en = flatten(dictionary.en).sort()
    const missing = [
      ...zh.filter((key) => !en.includes(key)).map((key) => `en:${key}`),
      ...en.filter((key) => !zh.includes(key)).map((key) => `zh:${key}`),
    ]
    if (missing.length)
      throw new Error(`${file}: missing ${missing.join(', ')}`)
    count += zh.length
    console.log(`✓ ${name}: ${zh.length} matching translation keys`)
  }
}
if (!count) throw new Error('No translation dictionaries found')
console.log(`✓ ${count} keys per language`)
