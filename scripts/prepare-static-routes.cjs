const fs = require('fs');
const path = require('path');

const clientDir = path.resolve(__dirname, '../dist/client');
if (!fs.existsSync(clientDir)) {
  console.log('dist/client not found, skipping post-build route preparation.');
  process.exit(0);
}

function ensureDirAndCopy(srcFile, targetIndexHtml) {
  const targetDir = path.dirname(targetIndexHtml);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  fs.copyFileSync(srcFile, targetIndexHtml);
}

console.log('Preparing static routes for AWS Amplify hosting...');

// 1. collections/index.html, shop/index.html, products/index.html, product/index.html from collections/all.html
const collAll = path.join(clientDir, 'collections/all.html');
if (fs.existsSync(collAll)) {
  ensureDirAndCopy(collAll, path.join(clientDir, 'collections/index.html'));
  ensureDirAndCopy(collAll, path.join(clientDir, 'shop/index.html'));
  ensureDirAndCopy(collAll, path.join(clientDir, 'products/index.html'));
  ensureDirAndCopy(collAll, path.join(clientDir, 'product/index.html'));
}

// 2. collections/*.html -> collections/*/index.html
const collDir = path.join(clientDir, 'collections');
if (fs.existsSync(collDir)) {
  const files = fs.readdirSync(collDir);
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace(/\.html$/, '');
      ensureDirAndCopy(path.join(collDir, file), path.join(collDir, name, 'index.html'));
    }
  }
}

// 3. products/*.html -> products/*/index.html and mirror to product/*/index.html
const prodDir = path.join(clientDir, 'products');
if (fs.existsSync(prodDir)) {
  const files = fs.readdirSync(prodDir);
  for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
      const name = file.replace(/\.html$/, '');
      const src = path.join(prodDir, file);
      ensureDirAndCopy(src, path.join(prodDir, name, 'index.html'));
      ensureDirAndCopy(src, path.join(clientDir, 'product', name, 'index.html'));
      ensureDirAndCopy(src, path.join(clientDir, 'product', file));
    }
  }
}

// 4. pages/*.html -> pages/*/index.html and top-level aliases
const pagesDir = path.join(clientDir, 'pages');
if (fs.existsSync(pagesDir)) {
  const files = fs.readdirSync(pagesDir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const name = file.replace(/\.html$/, '');
      const src = path.join(pagesDir, file);
      ensureDirAndCopy(src, path.join(pagesDir, name, 'index.html'));
      // Top-level aliases
      ensureDirAndCopy(src, path.join(clientDir, name, 'index.html'));
      if (name === 'our-story') {
        ensureDirAndCopy(src, path.join(clientDir, 'about/index.html'));
        ensureDirAndCopy(src, path.join(pagesDir, 'about/index.html'));
      }
    }
  }
}

// 5. cart.html -> cart/index.html
const cartFile = path.join(clientDir, 'cart.html');
if (fs.existsSync(cartFile)) {
  ensureDirAndCopy(cartFile, path.join(clientDir, 'cart/index.html'));
}

// 6. 404.html fallback from index.html
const indexFile = path.join(clientDir, 'index.html');
if (fs.existsSync(indexFile)) {
  fs.copyFileSync(indexFile, path.join(clientDir, '404.html'));
}

console.log('All static routes prepared successfully!');