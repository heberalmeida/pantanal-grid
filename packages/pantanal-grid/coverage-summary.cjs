const fs = require('fs')
const path = require('path')

const summaryPath = path.resolve(__dirname, 'coverage/coverage-summary.json')

if (!fs.existsSync(summaryPath)) {
  console.error('Error: coverage-summary.json not found. Run "yarn test:coverage" first.')
  process.exit(1)
}

const summary = JSON.parse(
  fs.readFileSync(summaryPath, 'utf8')
)

const directories = {}

for (const filePath in summary) {
  const data = summary[filePath]
  const dir = filePath.split('/').slice(0, 3).join('/')

  if (!directories[dir]) {
    directories[dir] = { lines: { total: 0, covered: 0 } }
  }

  directories[dir].lines.total += data.lines.total
  directories[dir].lines.covered += data.lines.covered
}

console.log('| Diretório | Cobertura Média |')
console.log('|-----------|------------------|')

for (const dir in directories) {
  const coverage =
    (directories[dir].lines.covered / directories[dir].lines.total) * 100
  const emoji =
    coverage === 0 ? '❌' : coverage >= 80 ? '✅' : coverage >= 60 ? '⚠️' : '❗'
  console.log(`| ${dir} | **${coverage.toFixed(2)}%** ${emoji} |`)
}
