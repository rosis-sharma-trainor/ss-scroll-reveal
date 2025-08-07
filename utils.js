const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function ensureMotionInstalled(baseDir) {
  const pkgPath = path.join(baseDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));

  if (!pkg.dependencies?.motion) {
    console.log('Installing motion...');
    execSync('yarn add motion', { cwd: baseDir, stdio: 'inherit' });
  }
}

async function updateIndexJs(indexPath, componentName) {
  const importPath = `@/scripts/components/${componentName}`;
  const importLine = `import ${componentName} from "${importPath}";`;
  const initLine = `${componentName}.init();`;

  let content = await fs.readFile(indexPath, 'utf8');

  if (!content.includes(importLine)) {
    content = `${importLine}\n${content}`;
  }

  if (!content.includes(initLine)) {
    content = `${content.trim()}\n\n${initLine}\n`;
  }

  await fs.writeFile(indexPath, content, 'utf8');
}

module.exports = { ensureMotionInstalled, updateIndexJs };