import fs from 'node:fs'
const [reportPath, version = 'B', ceilingsPath = 'perf/bench/ceilings.json', mode = 'fixed'] = process.argv.slice(2)
if (!reportPath) throw new Error('Usage: node perf/bench/ratchet.mjs <report.json> [A|B] [ceilings.json] [fixed|paired]')
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
const ceilings = JSON.parse(fs.readFileSync(ceilingsPath, 'utf8'))
const result = report.results[version]
if (!result || result.summary.n_ok < 10 || result.summary.n_ok !== result.summary.n) throw new Error('Ratchet requires at least 10 successful runs and zero failures')
let failed = false
for (const [metric, { value: limit, tolerance, noise_ms = 0 }] of Object.entries(ceilings)) {
  const actual = result.summary[metric]?.p75
  const threshold = mode === 'paired' ? report.results.A?.summary[metric]?.p75 : limit
  const ok = Number.isFinite(actual) && Number.isFinite(threshold) && actual <= threshold * (1 + tolerance) + noise_ms
  console.log(`${ok ? 'PASS' : 'FAIL'} ${metric} p75=${actual}, ${mode === 'paired' ? 'paired A' : 'fixed ceiling'}=${threshold} (+${tolerance * 100}%, +${noise_ms}ms quantization)`)
  if (!ok) failed = true
}
process.exitCode = failed ? 1 : 0
