/**
 * i18n 对称性检查：zh / en 两份字典的每个命名空间必须逐键一致。
 *
 * 为什么需要：resolve() 在找不到键时返回路径本身（'features.f13t'），
 * 漏翻不会报错、不会崩，只会在页面上露出一串原始 key 名——构建与 tsc 都发现不了。
 * 官网没有单元测试兜底，所以放在这里当门禁。
 *
 * 用法：npm run check:i18n
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const FILE = path.join('src', 'i18n.tsx')
const src = fs.readFileSync(FILE, 'utf8')

/** 取某个命名空间的键：ns: { ... } 块内的顶层 `key:` */
const keysOf = (body) => [...body.matchAll(/^\s{6}(\w+):/gm)].map((m) => m[1])

const namespaces = ['header', 'hero', 'mock', 'features', 'lunora', 'download', 'footer']

const pickBlock = (ns) => {
  // 两个语言各一份，按出现顺序取前两个
  const all = [...src.matchAll(new RegExp(`^    ${ns}: \\{([\\s\\S]*?)^    \\},`, 'gm'))].map((m) => m[1])
  return all.slice(0, 2)
}

let failed = false

for (const ns of namespaces) {
  const [zhBody, enBody] = pickBlock(ns)
  if (zhBody === undefined || enBody === undefined) {
    console.log(`✗ ${ns}: 期望 zh/en 各一份，实际 ${[zhBody, enBody].filter(Boolean).length} 份`)
    failed = true
    continue
  }
  const zh = keysOf(zhBody)
  const en = keysOf(enBody)
  const missEn = zh.filter((k) => !en.includes(k))
  const missZh = en.filter((k) => !zh.includes(k))
  if (missEn.length || missZh.length) {
    failed = true
    console.log(`✗ ${ns}  (zh=${zh.length} en=${en.length})`)
    if (missEn.length) console.log(`    英文缺: ${missEn.join(', ')}`)
    if (missZh.length) console.log(`    中文缺: ${missZh.join(', ')}`)
  } else {
    console.log(`✓ ${ns}  ${zh.length} 键对称`)
  }
}

process.exit(failed ? 1 : 0)
