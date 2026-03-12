// scripts/bump-version.js
// Bump the patch version, commit the change, and publish to npm.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the package.json file
const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Simple semver-major.minor.patch bump (increment patch)
function bumpPatch(version) {
  const parts = version.split('.');
  if (parts.length !== 3) {
    throw new Error('Version must be in major.minor.patch format');
  }
  const major = parseInt(parts[0] || '0');
  const minor = parseInt(parts[1] || '0');
  const patch = parseInt(parts[2] || '0');
  return `${major}.${minor}.${patch + 1}`;
}

// Get the new version
const newVersion = bumpPatch(pkg.version);
console.log(`Bumping version from ${pkg.version} to ${newVersion}`);

// Update the version field in package.json
pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

// Commit the version bump
execSync('git add ' + pkgPath, { stdio: 'inherit' });
execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });

// Publish to npm (public access)
console.log('Publishing version', newVersion);
execSync('npm publish --access public', { stdio: 'inherit' });
console.log('Publish successful!');