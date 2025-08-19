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
const CUSTOMERS_DIR = path.join(ROOT, 'content', 'customers');
const TEAMS_DIR = path.join(ROOT, 'content', 'teams');
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

async function loadCustomers() {
  await ensureDir(CUSTOMERS_DIR);
  const files = (await fs.readdir(CUSTOMERS_DIR)).filter(f => f.endsWith('.md'));
  const customers = [];
  for (const file of files) {
    const full = path.join(CUSTOMERS_DIR, file);
    const raw = await fs.readFile(full, 'utf8');
    const { meta, body } = extractFrontmatter(raw);
    if (!meta.id || !meta.name) {
      throw new Error(`Missing required fields 'id' and 'name' in ${file}`);
    }
    const stats = await fs.stat(full);
    const body_html = markdownToHtml(body);
    customers.push({
      ...meta,
      body_html,
      updated_at: stats.mtime.toISOString(),
      source_file: path.relative(ROOT, full),
      excerpt: body.replace(/\s+/g, ' ').slice(0, 240)
    });
  }
  // sort by name
  customers.sort((a, b) => a.name.localeCompare(b.name));
  return customers;
}

async function loadTeams() {
  await ensureDir(TEAMS_DIR);
  const files = (await fs.readdir(TEAMS_DIR)).filter(f => f.endsWith('.md'));
  const teams = [];
  for (const file of files) {
    const full = path.join(TEAMS_DIR, file);
    const raw = await fs.readFile(full, 'utf8');
    const { meta, body } = extractFrontmatter(raw);
    if (!meta.id || !meta.name) {
      throw new Error(`Missing required fields 'id' and 'name' in team ${file}`);
    }
    const stats = await fs.stat(full);
    const body_html = markdownToHtml(body);
    const meeting_dates = Array.isArray(meta.meeting_dates) ? meta.meeting_dates : [];
    const upcoming = meeting_dates
      .map(d => new Date(d))
      .filter(d => !isNaN(d.getTime()) && d >= new Date())
      .sort((a,b)=>a-b)[0];
    const asks = Array.isArray(meta.asks) ? meta.asks : [];
    const next_due = asks
      .map(a => ({...a, _d: new Date(a.due)}))
      .filter(a => a.due && !isNaN(a._d.getTime()))
      .sort((a,b)=>a._d - b._d)[0];
    teams.push({
      ...meta,
      body_html,
      updated_at: stats.mtime.toISOString(),
      source_file: path.relative(ROOT, full),
      excerpt: body.replace(/\s+/g, ' ').slice(0, 240),
      next_meeting_at: upcoming ? upcoming.toISOString() : null,
      next_due_ask: next_due ? { ask: next_due.ask, due: next_due.due, status: next_due.status } : null,
    });
  }
  teams.sort((a, b) => a.name.localeCompare(b.name));
  return teams;
}

async function build() {
  console.log('• Cleaning public/ ...');
  await fs.rm(PUBLIC_DIR, { recursive: true, force: true });
  await ensureDir(PUBLIC_DIR);

  console.log('• Copying static assets from src/ ...');
  await copyDir(SRC_DIR, PUBLIC_DIR);

  console.log('• Compiling customer markdown ...');
  const customersExternal = await loadCustomers();
  await ensureDir(DATA_DIR);
  // Keep writing standalone customers and teams for debugging
  await fs.writeFile(path.join(DATA_DIR, 'customers.external.json'), JSON.stringify({ customers: customersExternal }, null, 2));
  console.log('• Compiling teams markdown ...');
  const teams = await loadTeams();
  await fs.writeFile(path.join(DATA_DIR, 'teams.json'), JSON.stringify({ teams }, null, 2));

  // Normalize teams into unified customers list
  const normalizedTeams = teams.map(t => {
    const owner = (Array.isArray(t.members)? t.members.find(m => /lead/i.test(m.role||'')) : null) || (t.members && t.members[0]);
    const frameworks = Array.isArray(t.libraries) ? t.libraries.map(l => l.name).filter(Boolean) : [];
    const contacts = Array.isArray(t.members) ? t.members.map(m => ({ name: m.name, role: m.role, email: m.email||'' })) : [];
    return {
      id: t.id,
      name: t.name,
      account_owner: owner ? owner.name : '',
      frameworks,
      services: [],
      tags: ["internal", "team", ...(t.tags||[])],
      feature_requests: [],
      issues: [],
      contacts,
      avatar: t.avatar || '',
      members: t.members || [],
      libraries: t.libraries || [],
      meeting_dates: t.meeting_dates || [],
      asks: t.asks || [],
      body_html: t.body_html || '',
      updated_at: t.updated_at,
      source_file: t.source_file,
      excerpt: t.excerpt,
      customer_type: 'internal-team',
    };
  });

  const customers = [
    ...customersExternal.map(c => ({ ...c, customer_type: 'external', avatar: c.avatar||'' })),
    ...normalizedTeams
  ];

  // Sort unified customers by name
  customers.sort((a,b)=> a.name.localeCompare(b.name));
  await fs.writeFile(path.join(DATA_DIR, 'customers.json'), JSON.stringify({ customers }, null, 2));

  console.log(`✓ Built ${customersExternal.length} external customers, ${teams.length} teams → ${customers.length} unified customers.`);
  console.log('→ Open public/index.html via a local server (make run)');
}

build().catch((err) => {
  console.error('Build failed:', err.message);
  process.exit(1);
});
