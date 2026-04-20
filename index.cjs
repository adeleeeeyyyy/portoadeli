#!/usr/bin/env node
/**
 * generate_gallery.js  (Node.js version)
 * ───────────────────────────────────────
 * Scan folder ./gallery (rekursif) dan buat gallery.json otomatis.
 * Sama persis dengan versi Python, pilih yang lebih nyaman.
 *
 * Usage:
 *   node generate_gallery.js
 *   node generate_gallery.js --folder my_photos --out data/gallery.json
 */

const fs   = require('fs');
const path = require('path');

const IMAGE_EXTENSIONS = new Set(['.jpg','.jpeg','.png','.gif','.webp','.avif','.bmp','.svg']);

function scanFolder(baseFolder, currentDir, results = []) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  // Sort: folders first, then files
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue; // skip hidden

    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      scanFolder(baseFolder, fullPath, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!IMAGE_EXTENSIONS.has(ext)) continue;

      const relFromBase   = path.relative(path.dirname(baseFolder), fullPath);
      const relFromFolder = path.relative(baseFolder, fullPath);
      const category      = path.dirname(relFromFolder) === '.' ? 'uncategorized' : path.dirname(relFromFolder).replace(/\\/g, '/');
      const stem          = path.basename(entry.name, ext);
      const title         = stem.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      results.push({
        src:      relFromBase.replace(/\\/g, '/'),
        title:    title,
        category: category,
        filename: entry.name,
      });
    }
  }

  return results;
}

// ── Parse args ──
const args    = process.argv.slice(2);
const getArg  = (flag, def) => { const i = args.indexOf(flag); return i !== -1 ? args[i+1] : def; };
const folder  = path.resolve(getArg('--folder', 'gallery'));
const outFile = path.resolve(getArg('--out', 'gallery.json'));

// ── Run ──
if (!fs.existsSync(folder)) {
  console.log(`📁 Folder '${path.basename(folder)}' belum ada, membuat folder contoh...`);
  fs.mkdirSync(path.join(folder, 'projects'), { recursive: true });
  fs.mkdirSync(path.join(folder, 'life'),     { recursive: true });
  console.log(`✅ Folder dibuat: ${folder}/`);
  console.log(`   Taruh foto di dalamnya, lalu jalankan script ini lagi.`);
  fs.writeFileSync(outFile, JSON.stringify({ images:[], total:0, categories:[] }, null, 2));
  console.log(`📄 gallery.json dibuat (kosong).`);
  process.exit(0);
}

const images = scanFolder(folder, folder);

if (images.length === 0) {
  console.warn(`⚠️  Tidak ada gambar ditemukan di '${folder}'`);
} else {
  const cats = {};
  images.forEach(img => { cats[img.category] = (cats[img.category] || 0) + 1; });
  console.log(`🖼️  Ditemukan ${images.length} gambar:`);
  Object.entries(cats).forEach(([cat, n]) => console.log(`   📂 ${cat}/ → ${n} foto`));
}

const categories = [...new Set(images.map(i => i.category))].sort();
const result = {
  images,
  total:      images.length,
  categories,
  generated:  new Date().toISOString(),
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(result, null, 2));
console.log(`\n✅ gallery.json dibuat → ${outFile} (${images.length} foto)`);
