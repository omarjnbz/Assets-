#!/usr/bin/env node
/**
 * Walks the assets/ directory and emits a manifest.json file
 * containing every asset's CDN URL, size, type, and metadata.
 *
 * Runs in two contexts:
 *   1. GitHub Actions (uses GITHUB_REPOSITORY / GITHUB_REF_NAME env)
 *   2. Local dev      (falls back to `git remote` + current branch)
 *
 * Output is committed back to the repo so the gallery (index.html)
 * can fetch a static manifest.json without any backend.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets');
const OUTPUT = path.join(ROOT, 'manifest.json');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.avif', '.bmp', '.ico', '.heic']);
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.m4v', '.ogv', '.mkv']);
const AUDIO_EXTS = new Set(['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac']);

function getType(ext) {
  const e = ext.toLowerCase();
  if (IMAGE_EXTS.has(e)) return 'image';
  if (VIDEO_EXTS.has(e)) return 'video';
  if (AUDIO_EXTS.has(e)) return 'audio';
  return 'other';
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue; // skip .gitkeep etc.
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function getRepoInfo() {
  // GitHub Actions context
  const repoEnv = process.env.GITHUB_REPOSITORY;
  if (repoEnv) {
    const [owner, repo] = repoEnv.split('/');
    return {
      owner,
      repo,
      branch: process.env.GITHUB_REF_NAME || 'main',
    };
  }
  // Local fallback
  try {
    const url = execSync('git config --get remote.origin.url', { encoding: 'utf8', cwd: ROOT }).trim();
    // Match git@github.com:owner/repo.git or https://github.com/owner/repo.git
    const m = url.match(/[:/]([^/:]+)\/([^/]+?)(\.git)?$/);
    if (m) {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8', cwd: ROOT }).trim();
      return { owner: m[1], repo: m[2], branch };
    }
  } catch (_) {
    // ignore
  }
  console.warn('⚠  Could not detect repo info — using placeholders. URLs will need fixing.');
  return { owner: 'YOUR_USERNAME', repo: 'YOUR_REPO', branch: 'main' };
}

function humanSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

const { owner, repo, branch } = getRepoInfo();
const files = walk(ASSETS_DIR).sort();

const assets = files.map((file) => {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  const stat = fs.statSync(file);
  const ext = path.extname(file);
  const encodedPath = rel.split('/').map(encodeURIComponent).join('/');
  return {
    name: path.basename(file),
    path: rel,
    folder: path.dirname(rel).replace(/^assets\/?/, '') || 'root',
    type: getType(ext),
    ext: ext.slice(1).toLowerCase(),
    size: stat.size,
    sizeHuman: humanSize(stat.size),
    modified: stat.mtime.toISOString(),
    cdnUrl: `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${encodedPath}`,
    rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedPath}`,
  };
});

const manifest = {
  repo: `${owner}/${repo}`,
  branch,
  generated: new Date().toISOString(),
  count: assets.length,
  totalSize: assets.reduce((a, b) => a + b.size, 0),
  assets,
};

fs.writeFileSync(OUTPUT, JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ Wrote ${assets.length} assets to manifest.json`);
console.log(`  Repo:   ${manifest.repo}@${manifest.branch}`);
console.log(`  Total:  ${humanSize(manifest.totalSize)}`);
