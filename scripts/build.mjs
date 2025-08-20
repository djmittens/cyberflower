#!/usr/bin/env node
// Build script: compiles Markdown customer files into JSON and copies SPA assets
// Frontmatter format: JSON between --- delimiters at the top of each .md file

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const RECORDS_DIR = path.join(ROOT, 'content', 'customers');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = path.join(PUBLIC_DIR, 'data');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function extractFrontmatter(md) {
  const fmMatch = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) return { meta: {}, body: md.trim() };
  const jsonText = fmMatch[1];
  let meta = {};
  try {
    meta = JSON.parse(jsonText);
  } catch (e) {
    throw new Error('Failed to parse JSON frontmatter. Ensure JSON between --- delimiters.\n' + e.message);
  }
  const body = md.slice(fmMatch[0].length);
  return { meta, body: body.trim() };
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function markdownToHtml(md) {
  // Very small, non-compliant Markdown converter for headings, lists, code, bold/italic, links, paragraphs.
  // 1) Extract fenced code blocks first
  const codeBlocks = [];
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre class="code"><code>${escapeHtml(code.trim())}</code></pre>`);
    return `@@CODE_BLOCK_${idx}@@`;
  });

  const lines = md.split(/\r?\n/);
  const out = [];
  let inList = false;

  const flushParagraph = (buf) => {
    const text = buf.join(' ').trim();
    if (!text) return;
    out.push(`<p>${inline(text)}</p>`);
    buf.length = 0;
  };

  let pbuf = [];

  function inline(s) {
    // links [text](url)
    s = s.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>');
    // bold **text**
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // italics *text*
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // inline code `code`
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    return s;
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (/^\s*$/.test(line)) {
      // blank line
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      flushParagraph(pbuf);
      continue;
    }

    // headings
    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      if (inList) {
        out.push('</ul>');
        inList = false;
      }
      flushParagraph(pbuf);
      const level = m[1].length;
      out.push(`<h${level}>${inline(m[2])}</h${level}>`);
      continue;
    }

    // list items
    if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushParagraph(pbuf);
      if (!inList) {
        out.push('<ul>');
        inList = true;
      }
      out.push(`<li>${inline(m[1])}</li>`);
      continue;
    }

    // default: paragraph line
    pbuf.push(line);
  }

  if (inList) out.push('</ul>');
  flushParagraph(pbuf);

  let html = out.join('\n');
  // restore code blocks
  html = html.replace(/@@CODE_BLOCK_(\d+)@@/g, (_, i) => codeBlocks[Number(i)] || '');
  return html;
}

async function loadRecords() {
  await ensureDir(RECORDS_DIR);
  const files = (await fs.readdir(RECORDS_DIR)).filter(f => f.endsWith('.md'));
  const records = [];
  for (const file of files) {
    const full = path.join(RECORDS_DIR, file);
    const raw = await fs.readFile(full, 'utf8');
    const { meta, body } = extractFrontmatter(raw);
    if (!meta.id || !meta.name) {
      throw new Error(`Missing required fields 'id' and 'name' in ${file}`);
    }
    const stats = await fs.stat(full);
    const body_html = markdownToHtml(body);
    // derive helpful fields if missing
    const members = Array.isArray(meta.members) ? meta.members : [];
    const libraries = Array.isArray(meta.libraries) ? meta.libraries : [];
    const frameworksFromLibs = libraries.map(l => l.name).filter(Boolean);
    const frameworks = Array.isArray(meta.frameworks) ? meta.frameworks : frameworksFromLibs;
    const ownerFromMembers = members.find(m => /lead|owner|manager/i.test(m.role||'')) || members[0];
    const account_owner = meta.account_owner || (ownerFromMembers ? ownerFromMembers.name : '');
    const meeting_dates = Array.isArray(meta.meeting_dates) ? meta.meeting_dates : [];
    const asks = Array.isArray(meta.asks) ? meta.asks : [];
    const excerpt = body.replace(/\s+/g, ' ').slice(0, 240);
    // avatar resolution: explicit meta > file named after id > template
    let avatar = meta.avatar || '';
    if (!avatar) {
      const candidate = path.join(SRC_DIR, 'assets', 'avatars', `${meta.id}.svg`);
      try { await fs.access(candidate); avatar = `assets/avatars/${meta.id}.svg`; } catch {}
    }
    if (!avatar) avatar = 'assets/avatars/avatar-template.svg';
    records.push({
      ...meta,
      avatar,
      account_owner,
      frameworks,
      members,
      libraries,
      meeting_dates,
      asks,
      body_html,
      updated_at: stats.mtime.toISOString(),
      source_file: path.relative(ROOT, full),
      excerpt,
    });
  }
  records.sort((a, b) => a.name.localeCompare(b.name));
  return records;
}

async function build() {
  console.log('• Cleaning public/ ...');
  await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
  await ensureDir(PUBLIC_DIR);

  console.log('• Copying static assets from src/ ...');
  await copyDir(SRC_DIR, PUBLIC_DIR);

  console.log('• Compiling records (customers + teams) ...');
  const customers = await loadRecords();
  await ensureDir(DATA_DIR);
  await fs.writeFile(path.join(DATA_DIR, 'customers.json'), JSON.stringify({ customers }, null, 2));

  console.log(`✓ Built ${customers.length} records from content/customers/`);
  console.log('→ Open public/index.html via a local server (make run)');
}

build().catch((err) => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
