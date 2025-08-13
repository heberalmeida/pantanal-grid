const fs = require('fs');
const path = require('path');

const libPkgPath = path.join(process.cwd(), 'packages', 'pantanal-grid', 'package.json');
const pgPkgPath  = path.join(process.cwd(), 'playground', 'package.json');

const lib = JSON.parse(fs.readFileSync(libPkgPath, 'utf8'));
const pg  = JSON.parse(fs.readFileSync(pgPkgPath,  'utf8'));
pg.dependencies = pg.dependencies || {};

const names = [
  '@pantanal/grid',
  'pantanal-grid'
];

const name = names.find(n => n in pg.dependencies);
if (!name) {
  console.log('No grid dependency found in playground. Skipping pin.');
  process.exit(0);
}

const wanted = `^${lib.version}`;
if (pg.dependencies[name] !== wanted) {
  pg.dependencies[name] = wanted;
  fs.writeFileSync(pgPkgPath, JSON.stringify(pg, null, 2) + '\n');
  console.log(`Pinned ${name} -> ${wanted}`);
} else {
  console.log(`Playground already pinned: ${name} -> ${wanted}`);
}
