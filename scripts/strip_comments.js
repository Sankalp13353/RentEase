#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir, cb) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'build', 'dist'].includes(entry.name)) continue;
      walk(full, cb);
    } else {
      cb(full);
    }
  }
}

function removeCommentsFromText(content, ext) {
  if (ext === '.css' || ext === '.html') {
    // remove /* */ and <!-- -->
    content = content.replace(/\/\*[\s\S]*?\*\//g, '');
    content = content.replace(/<!--([\s\S]*?)-->/g, '');
    return content;
  }
  if (ext === '.env') {
    // remove lines starting with #
    return content.split(/\r?\n/).filter(l => !/^\s*#/.test(l)).join('\n');
  }
  if (ext === '.md' || ext === '.txt') {
    // remove HTML comments
    return content.replace(/<!--([\s\S]*?)-->/g, '');
  }
  return content;
}

function processWithBabel(fullPath, code) {
  try {
    const parser = require('@babel/parser');
    const generator = require('@babel/generator').default;
    const plugins = ['jsx', 'classProperties', 'optionalChaining', 'nullishCoalescingOperator'];
    if (/\.tsx?$/.test(fullPath)) plugins.push('typescript');
    const ast = parser.parse(code, {
      sourceType: 'unambiguous',
      plugins,
      allowReturnOutsideFunction: true,
      errorRecovery: true,
    });
    const out = generator(ast, { comments: false, retainLines: true }, code);
    return out.code;
  } catch (err) {
    console.error('Babel failed for', fullPath, err.message);
    return null;
  }
}

function processFile(fullPath) {
  const ext = path.extname(fullPath).toLowerCase();
  const textExts = ['.md', '.css', '.html', '.env', '.txt'];
  const codeExts = ['.js', '.jsx', '.ts', '.tsx'];
  if (![...textExts, ...codeExts].includes(ext)) return false;
  let code = fs.readFileSync(fullPath, 'utf8');
  if (code.trim().length === 0) return false;

  if (codeExts.includes(ext)) {
    const result = processWithBabel(fullPath, code);
    if (result === null) return false;
    // additionally remove JSX-style comments {/* ... */}
    const final = result.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    if (final !== code) {
      fs.writeFileSync(fullPath, final, 'utf8');
      return true;
    }
    return false;
  }

  if (textExts.includes(ext)) {
    const newText = removeCommentsFromText(code, ext);
    if (newText !== code) {
      fs.writeFileSync(fullPath, newText, 'utf8');
      return true;
    }
    return false;
  }
  return false;
}

function main() {
  const root = process.cwd();
  const changed = [];
  walk(root, (fullPath) => {
    // skip build files and some binary/large files
    if (fullPath.includes('/build/') || fullPath.includes('/dist/') || fullPath.includes('.git/')) return;
    // skip compiled license/min files
    if (/\.LICENSE\.txt$/.test(fullPath)) return;

    const rel = path.relative(root, fullPath);
    // limit to frontend and backend and root source files
    if (!rel.startsWith('frontend') && !rel.startsWith('backend') && rel.startsWith('.') === false && !['package.json','README.md'].includes(path.basename(fullPath))) return;

    const processed = processFile(fullPath);
    if (processed) changed.push(rel);
  });

  console.log('Files changed:', changed.length);
  for (const f of changed) console.log(' -', f);
}

main();
