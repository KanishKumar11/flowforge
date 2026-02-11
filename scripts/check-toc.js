const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'features', 'project-report', 'pdf', 'sections', 'TableOfContents.tsx');
const txt = fs.readFileSync(file, 'utf8');
const re = /\{[^}]*title:\s*"([^"]+)"[^}]*page:\s*"([^"]+)"[^}]*\}/g;
let m;
const items = [];
while ((m = re.exec(txt)) !== null) {
  const title = m[1];
  const page = m[2];
  items.push({ title, page });
}
console.log(`Found ${items.length} toc entries`);
// Basic checks
function toNum(p) {
  const n = parseInt(p.replace(/[^0-9]/g, ''), 10);
  return isNaN(n) ? null : n;
}
let lastMain = -Infinity;
const problems = [];
for (let i = 0; i < items.length; i++) {
  const it = items[i];
  const num = toNum(it.page);
  if (num === null) {
    problems.push(`Non-numeric page on entry '${it.title}' page='${it.page}'`);
  }
}
// Check that chapter mains are ascending
const mainRe = /\{\s*chapter:\s*"(\d{2})",\s*title:\s*"([^"]+)",\s*page:\s*"(\d+)"/g;
let mm;
let last = -1;
while ((mm = mainRe.exec(txt)) !== null) {
  const chap = mm[1];
  const title = mm[2];
  const page = parseInt(mm[3], 10);
  if (page <= last) {
    problems.push(`Chapter ${chap} ('${title}') has non-ascending page ${page} (prev ${last})`);
  }
  last = page;
}
if (problems.length === 0) {
  console.log('Quick sanity check passed — no obvious numeric issues');
} else {
  console.log('Problems:');
  console.log(problems.join('\n'));
}
process.exit(problems.length === 0 ? 0 : 1);
