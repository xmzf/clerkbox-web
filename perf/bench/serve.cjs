// Serve both snapshots with the same uncompressed HTTP implementation.
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 5183)
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.json': 'application/json' }
http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname)
  let file = path.resolve(root, `.${pathname}`)
  if (!file.startsWith(`${root}${path.sep}`) && file !== root) { response.writeHead(403).end(); return }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(root, 'index.html')
  response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  fs.createReadStream(file).pipe(response)
}).listen(port, '127.0.0.1', () => console.log(`Snapshot: ${root} at http://127.0.0.1:${port}/`))
