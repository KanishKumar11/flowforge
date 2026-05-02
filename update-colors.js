const fs = require('fs');
const path = require('path');
const dir = 'src/features/project-report/pdf/sections';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
let totalChanges = 0;
for (const f of files) {
  const fp = path.join(dir, f);
  let s = fs.readFileSync(fp, 'utf8');
  const orig = s;
  s = s.split('backgroundColor: "#f5f5f5"').join('backgroundColor: "#f8fafc"');
  s = s.split('backgroundColor: "#f9f9f9"').join('backgroundColor: "#f8fafc"');
  s = s.split('backgroundColor: "#f8f8f8"').join('backgroundColor: "#f8fafc"');
  s = s.split('borderLeftColor: "#333333"').join('borderLeftColor: "#1e293b"');
  if (s !== orig) {
    fs.writeFileSync(fp, s);
    totalChanges++;
    console.log('Updated:', f);
  }
}
console.log('Total files updated:', totalChanges);
