const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../src/docs/openapi.yaml');
const destDir = path.join(__dirname, '../dist/docs');
const dest = path.join(destDir, 'openapi.yaml');

fs.mkdirSync(destDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log(`Copied OpenAPI spec to ${dest}`);
