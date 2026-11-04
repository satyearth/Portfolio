/**
 * Portfolio Code Quality & Asset Integrity Validator
 * Validates HTML, CSS, JavaScript, assets, SVG sprites, and DOM integrity.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
let errorCount = 0;
let warnCount = 0;

function reportPass(msg) {
  console.log(`  [PASS] ${msg}`);
}

function reportWarn(msg) {
  console.warn(`  [WARN] ${msg}`);
  warnCount++;
}

function reportFail(msg) {
  console.error(`  [FAIL] ${msg}`);
  errorCount++;
}

console.log('\n--- 1. Validating Core File Structure ---');
const requiredFiles = [
  'index.html',
  'css/style.css',
  'js/main.js',
  'assets/images/avatar.jpg',
  'assets/images/article-ai-data-analyst.jpg',
  'assets/images/article-prompt-engineering.jpg',
  'assets/images/article-vibe-coding.jpg',
  'server.js',
  'package.json',
  'vercel.json',
  'README.md'
];

requiredFiles.forEach((file) => {
  const fullPath = path.join(ROOT, file);
  if (fs.existsSync(fullPath)) {
    reportPass(`Found: ${file}`);
  } else {
    reportFail(`Missing critical file: ${file}`);
  }
});

console.log('\n--- 2. Validating HTML Asset References & Syntax ---');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Check script and stylesheet links
if (indexHtml.includes('href="css/style.css"')) {
  reportPass('Stylesheet linked correctly to css/style.css');
} else {
  reportFail('Stylesheet not linked to css/style.css');
}

if (indexHtml.includes('src="js/main.js"')) {
  reportPass('Script linked correctly to js/main.js');
} else {
  reportFail('Script not linked to js/main.js');
}

// Check image paths in index.html
const imgRegex = /src=["'](assets\/images\/[^"']+)["']/g;
let match;
let imgCount = 0;
while ((match = imgRegex.exec(indexHtml)) !== null) {
  imgCount++;
  const imgRel = match[1];
  const imgFull = path.join(ROOT, imgRel);
  if (fs.existsSync(imgFull)) {
    reportPass(`Image reference exists: ${imgRel}`);
  } else {
    reportFail(`Broken image reference: ${imgRel}`);
  }
}
if (imgCount === 0) {
  reportFail('No images found in index.html matching assets/images/');
}

console.log('\n--- 3. Validating SVG Sprite References ---');
const definedSymbols = new Set();
const symbolDefRegex = /<symbol\s+id=["']([^"']+)["']/g;
while ((match = symbolDefRegex.exec(indexHtml)) !== null) {
  definedSymbols.add(match[1]);
}

const usedSymbols = new Set();
const symbolUseRegex = /<use\s+href=["']#([^"']+)["']/g;
while ((match = symbolUseRegex.exec(indexHtml)) !== null) {
  usedSymbols.add(match[1]);
}

usedSymbols.forEach((sym) => {
  if (definedSymbols.has(sym)) {
    reportPass(`SVG Symbol resolved: #${sym}`);
  } else {
    reportFail(`Missing SVG Symbol in sprite: #${sym}`);
  }
});

console.log('\n--- 4. Validating CSS Syntax & Asset Paths ---');
const cssContent = fs.readFileSync(path.join(ROOT, 'css/style.css'), 'utf8');

// Check bracket balance
let openBraces = (cssContent.match(/\{/g) || []).length;
let closeBraces = (cssContent.match(/\}/g) || []).length;
if (openBraces === closeBraces) {
  reportPass(`CSS braces balanced perfectly (${openBraces} rules)`);
} else {
  reportFail(`CSS brace mismatch! { = ${openBraces}, } = ${closeBraces}`);
}

// Check CSS url() paths (excluding data URIs and external URLs)
const cleanCss = cssContent.replace(/url\(["']?data:[^)]+\)/g, '');
const urlRegex = /url\(["']?([^"')]+)["']?\)/g;
while ((match = urlRegex.exec(cleanCss)) !== null) {
  const urlVal = match[1];
  if (urlVal.startsWith('data:') || urlVal.startsWith('http') || urlVal.startsWith('#')) continue;
  const resolved = path.resolve(path.join(ROOT, 'css'), urlVal);
  if (fs.existsSync(resolved)) {
    reportPass(`CSS asset resolved: ${urlVal} -> ${path.relative(ROOT, resolved)}`);
  } else {
    reportFail(`Broken CSS asset reference: ${urlVal} (searched at ${resolved})`);
  }
}

console.log('\n--- 5. Validating JavaScript Syntax & Export ---');
try {
  const jsContent = fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8');
  // Syntax check via Function constructor
  new Function(jsContent);
  reportPass('js/main.js syntax is valid ECMAScript');
} catch (err) {
  reportFail(`js/main.js syntax error: ${err.message}`);
}

console.log('\n--- 6. Validating Accessibility & ARIA Attributes ---');
if (indexHtml.includes('role="tablist"') && indexHtml.includes('role="tab"') && indexHtml.includes('role="tabpanel"')) {
  reportPass('ARIA tablist, tab, and tabpanel attributes are present');
} else {
  reportWarn('Incomplete ARIA tab roles in index.html');
}

if (indexHtml.includes('data-theme="light"')) {
  reportPass('Default Light Theme configuration verified');
} else {
  reportFail('Default data-theme="light" attribute missing on <html>');
}

console.log('\n========================================');
console.log(`Validation Complete: ${errorCount} Errors, ${warnCount} Warnings`);
console.log('========================================\n');

if (errorCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
