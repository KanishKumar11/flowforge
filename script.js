const fs = require('fs');

let content = fs.readFileSync('src/app/(dashboard)/(rest)/teams/[teamId]/page.tsx', 'utf8');

// 1. Remove pink background in Danger Zone, replace with theme-aware destructive styles
content = content.replace(
  'className="border-red-500/20 bg-red-50/50 dark:bg-red-950/10"',
  'className="border-destructive/20 bg-destructive/5 text-destructive"'
);
content = content.replace(
  'text-red-600 dark:text-red-400',
  'text-destructive'
);
content = content.replace(
  'hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10',
  'hover:bg-destructive/10 hover:text-destructive'
);

// 2. Remove hardcoded zinc background that clashes with theme emerald/dark modes
content = content.replace(
  'bg-zinc-900 text-zinc-50 dark:bg-white dark:text-zinc-950 border-none',
  'bg-primary text-primary-foreground border-none'
);

// 3. Remove hardcoded page backgrounds so it follows the global theme variables
content = content.replace(
  'bg-[#f9fafb] dark:bg-zinc-950',
  'bg-background'
);

// 4. Overuse of font-mono makes it look bad instead of a proper functional font. Replace mostly with font-sans, or just drop it.
content = content.replace(/font-mono/g, 'font-sans');

// 5. Ensure all interactive buttons/elements have explicit cursor-pointer on hover
content = content.replace(
  /motion\.button([^>]+)className="/g,
  'motion.button$1className="cursor-pointer '
);

// Apply cursor-pointer on standard buttons where it might be omitted by default or overridden
content = content.replace(
  /<Button /g,
  '<Button className="cursor-pointer" '
);
// Specifically fixing my own button classes since I added 'className="..."' to most
content = content.replace(
  /<Button([^>]+?)className="/g,
  '<Button$1className="cursor-pointer '
);

fs.writeFileSync('src/app/(dashboard)/(rest)/teams/[teamId]/page.tsx', content, 'utf8');
console.log('Fixed themes, fonts, and cursors.');
