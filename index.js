#!/usr/bin/env node
const path = require('path');
const fs = require('fs-extra');
const { ensureMotionInstalled, updateIndexJs } = require('./utils');

const baseDir = process.cwd();
const jsTarget = path.join(baseDir, 'themes/app/src/scripts/components/scroll-reveal.js');
const cssTarget = path.join(baseDir, 'themes/app/src/styles/components/scroll-reveal.css');
const jsTemplate = path.join(__dirname, '/templates/scroll-reveal.js');
const cssTemplate = path.join(__dirname, '/templates/scroll-reveal.css');
const indexJsPath = path.join(baseDir, 'themes/app/src/index.js');

async function scaffoldScrollReveal() {
  await ensureMotionInstalled(baseDir);

  await fs.copy(jsTemplate, jsTarget);
  await fs.copy(cssTemplate, cssTarget);

  await updateIndexJs(indexJsPath, 'scrollReveal');

  console.log('Scroll Reveal scaffolded successfully.');
}

scaffoldScrollReveal();