const fs = require('fs');
const path = require('path');

const libPkgPath = path.join(__dirname, '..', 'packages', 'pantanal-grid', 'package.json');
const pgPkgPath  = path.join(__dirname, '..', 'playground', 'package.json');

const lib = JSON.parse(fs.readFileSync(libPkgPath, 'utf8'));
const pg  = JSON.parse(fs.readFileSync(pgPkgPath,  'utf8'));
pg.dependencies = pg.dependencies || {};

const candidates = [
  '@pantanal/grid',
  '@pantanalms/grid',
  'pantanal-grid',
  'pantanalms-grid'
];

const name = candidates.find(n => n in pg.dependencies);
if (!name) {
  console.log('No grid dependency found in playground. Skipping pin.');
  process.exit(0);
}

const wanted = `^${lib.version}`;
if (pg.dependencies[name] === wanted) {
  console.log(`Playground already pinned: ${name} -> ${wanted}`);
  process.exit(0);
}

pg.dependencies[name] = wanted;
fs.writeFileSync(pgPkgPath, JSON.stringify(pg, null, 2) + '\n');
console.log(`Pinned ${name} to ${wanted}`);
