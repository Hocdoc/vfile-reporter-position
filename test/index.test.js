import * as assert from 'assert';
import { VFile } from 'vfile';
import reporter from '../dist/index.js';

const file1 = new VFile({
  path: 'src/test.md',
  contents: 'hurrra braavo Jawa!',
});
file1.message(
  '`braavo` is misspelt; did you mean `bravo`?',
  { start: { line: 1, column: 8 }, end: { line: 1, column: 14 } },
  'spell:typo'
);
const warning = file1.message(
  '`Jawa` is maybe misspelt; did you mean `Java`?',
  { start: { line: 1, column: 16 }, end: { line: 1, column: 20 } },
  'spell:warn'
);
warning.fatal = false;

const file2 = new VFile({
  path: 'src/other/dir/test.md',
  contents: 'Hallo world!',
});
file2.message(
  '`Hallo` is misspelt; did you mean `Hello`?',
  { start: { line: 1, column: 1 }, end: { line: 1, column: 6 } },
  'spell:typo'
);

const result = reporter([file1, file2]);
assert.strictEqual(
  result,
  `\
src/test.md
  ⚠ src/test.md:1:8 - warning spell:typo \`braavo\` is misspelt; did you mean \`bravo\`?
  ⚠ src/test.md:1:16 - warning spell:warn \`Jawa\` is maybe misspelt; did you mean \`Java\`?
src/other/dir/test.md
  ⚠ src/other/dir/test.md:1:1 - warning spell:typo \`Hallo\` is misspelt; did you mean \`Hello\`?

0 errors and 3 warnings`
);
