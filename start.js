'use strict';

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const buildPath = path.resolve(__dirname, '.vite', 'build', 'main.js');

if (fs.existsSync(buildPath)) {
  try {
    require(buildPath);
  } catch (err) {
    console.error('Erreur lors de l\'import du build :', err);
    process.exit(1);
  }
} else {
  console.warn('Fichier de build introuvable :', buildPath);
  console.warn('Générez le build avec `npm run build` ou utilisez `npm run preview` pour un aperçu.');

  // Lancement de preview en fallback pour empêcher une sortie prématurée
  const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = spawn(npmCmd, ['run', 'preview'], { stdio: 'inherit' });

  child.on('close', (code) => process.exit(code));
}
