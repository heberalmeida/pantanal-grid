const fs = require('fs');
const p = 'packages/pantanal-grid/src/index.ts';
if (!fs.existsSync(p)) {
  fs.writeFileSync(p, "import PantanalGrid from './components/Grid.vue'\nimport './styles.css'\nexport { PantanalGrid }\n");
  console.log('> created src/index.ts');
} else {
  let s = fs.readFileSync(p, 'utf8');
  if (!/styles\.css/.test(s)) {
    s = "import './styles.css'\n" + s;
    fs.writeFileSync(p, s);
    console.log('> injected styles import in src/index.ts');
  }
}
