import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ts from 'typescript'

// Evaluate only the dependency-free content dictionaries, then compare every leaf.
// This also covers new namespaces without a hard-coded list or indentation regex.
const files = fs.readdirSync('src/content').filter(file => file.endsWith('.ts'))
const flatten = (value, prefix = '') => {
  if (typeof value === 'string') {
    if (!value.trim()) throw new Error(`Empty translation: ${prefix}`)
    return [prefix]
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(`Invalid dictionary: ${prefix}`)
  return Object.entries(value).flatMap(([key, child]) => flatten(child, prefix ? `${prefix}.${key}` : key))
}
let count = 0
for (const file of files) {
  const source = fs.readFileSync(path.join('src/content', file), 'utf8')
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  const sandbox = { exports: {} }
  vm.runInNewContext(result.outputText, sandbox, { timeout: 1000, filename: file })
  for (const [name, dictionary] of Object.entries(sandbox.exports)) {
    const zh = flatten(dictionary.zh).sort()
    const en = flatten(dictionary.en).sort()
    const missing = [...zh.filter(key => !en.includes(key)).map(key => `en:${key}`), ...en.filter(key => !zh.includes(key)).map(key => `zh:${key}`)]
    if (missing.length) throw new Error(`${file}: missing ${missing.join(', ')}`)
    count += zh.length
    console.log(`✓ ${name}: ${zh.length} matching translation keys`)
  }
}
if (!count) throw new Error('No translation dictionaries found')
console.log(`✓ ${count} keys per language`)
