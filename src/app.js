const state = {
  all: [],
  filtered: [],
  facets: { type: new Map(), frameworks: new Map(), services: new Map(), tags: new Map() },
  active: { query: '', type: new Set(), frameworks: new Set(), services: new Set(), tags: new Set(), sort: 'name' },
};

function $(sel) { return document.querySelector(sel); }
function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; }

// Minimal inline iconography (monochrome SVG; styled via CSS color)
function icon(name, size = 14) {
  const p = (d) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  switch (name) {
    case 'users':
      return p('M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5 1.343 3.5 3 3.5zm-8 0C9.657 11 11 9.433 11 7.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zm0 2c-2.761 0-5 1.57-5 3.5V19h10v-2.5c0-1.93-2.239-3.5-5-3.5zm8 0c-.695 0-1.352.1-1.956.28 1.209.86 1.956 2.047 1.956 3.22V19h6v-2.5c0-1.93-2.239-3.5-5-3.5z');
    case 'tag':
      return p('M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12.99V4h8.99l8.6 8.6a2 2 0 0 1 0 2.81zM7.5 7A1.5 1.5 0 1 0 7.5 10 1.5 1.5 0 1 0 7.5 7z');
    case 'wrench':
      return p('M22.7 19.3l-6.4-6.4a6 6 0 0 1-7.9-7.9l3.2 3.2 2.1-2.1-3.2-3.2a6 6 0 0 1 7.9 7.9l6.4 6.4-2.1 2.1zM4 20a4 4 0 1 0 0-8 4 4 0 1 0 0 8z');
    case 'chip':
      return p('M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm2 6h6v8H9V8z');
    case 'calendar':
      return p('M7 2h2v2h6V2h2v2h3v16H4V4h3V2zm0 6v10h10V8H7z');
    default:
      return '';
  }
}

async function loadData() {
  const res = await fetch('data/customers.json');
  const data = await res.json();
  state.all = data.customers || [];
  indexFacets();
  applyFilters();
}

function indexFacets() {
  state.facets.type.clear();
  state.facets.frameworks.clear();
  state.facets.services.clear();
  state.facets.tags.clear();
  for (const c of state.all) {
    const typ = c.customer_type || 'external';
    state.facets.type.set(typ, (state.facets.type.get(typ)||0)+1);
    (c.frameworks || []).forEach(f => state.facets.frameworks.set(f, (state.facets.frameworks.get(f)||0)+1));
    (c.services || []).forEach(s => state.facets.services.set(s, (state.facets.services.get(s)||0)+1));
    (c.tags || []).forEach(t => state.facets.tags.set(t, (state.facets.tags.get(t)||0)+1));
  }
  renderFacet('#facet-type', 'type');
  renderFacet('#facet-frameworks', 'frameworks');
  renderFacet('#facet-services', 'services');
  renderFacet('#facet-tags', 'tags');
}

function renderFacet(containerSel, key) {
  const container = $(containerSel);
  if (!container) return;
  container.innerHTML = '';
  const items = Array.from(state.facets[key].entries()).sort((a,b)=>a[0].localeCompare(b[0]));
  for (const [name, count] of items) {
    const chip = el('div', 'chip', `${name} <span style="opacity:.6">(${count})</span>`);
    if (state.active[key].has(name)) chip.classList.add('active');
    chip.addEventListener('click', () => {
      if (state.active[key].has(name)) state.active[key].delete(name); else state.active[key].add(name);
      renderFacet(containerSel, key);
      scheduleApplyFilters();
    });
    container.appendChild(chip);
  }
}

function applyFilters() {
  const q = state.active.query.toLowerCase().trim();
  let items = state.all.filter(c => {
    const matchesText = !q || (
      (c.name||'').toLowerCase().includes(q) ||
      (c.account_owner||'').toLowerCase().includes(q) ||
      (c.excerpt||'').toLowerCase().includes(q) ||
      (c.frameworks||[]).some(x=>x.toLowerCase().includes(q)) ||
      (c.services||[]).some(x=>x.toLowerCase().includes(q)) ||
      (c.tags||[]).some(x=>x.toLowerCase().includes(q)) ||
      (c.members||[]).some(m=> (m.name||'').toLowerCase().includes(q) || (m.role||'').toLowerCase().includes(q)) ||
      (c.libraries||[]).some(l=> (l.name||'').toLowerCase().includes(q) || (l.project||'').toLowerCase().includes(q))
    );
    const matchesType = state.active.type.size===0 || state.active.type.has(c.customer_type||'external');
    const matchesFrameworks = state.active.frameworks.size===0 || (c.frameworks||[]).some(x=>state.active.frameworks.has(x));
    const matchesServices = state.active.services.size===0 || (c.services||[]).some(x=>state.active.services.has(x));
    const matchesTags = state.active.tags.size===0 || (c.tags||[]).some(x=>state.active.tags.has(x));
    return matchesText && matchesType && matchesFrameworks && matchesServices && matchesTags;
  });

  const sortKey = state.active.sort;
  if (sortKey === 'name') items.sort((a,b)=>a.name.localeCompare(b.name));
  if (sortKey === 'updated') items.sort((a,b)=>new Date(b.updated_at) - new Date(a.updated_at));
  if (sortKey === 'priority') {
    const score = (c) => {
      const p = (c.feature_requests||[]).reduce((acc, fr)=>acc + (fr.priority==='high'?3: fr.priority==='medium'?2: fr.priority==='low'?1:0), 0);
      const sev = (c.issues||[]).reduce((acc, is)=>acc + (is.severity==='critical'?3: is.severity==='major'?2: is.severity==='minor'?1:0), 0);
      return p*10 + sev;
    };
    items.sort((a,b)=>score(b)-score(a));
  }

  state.filtered = items;
  renderGrid();
}

function renderGrid() {
  const grid = $('#grid');
  grid.innerHTML = '';
  const frag = document.createDocumentFragment();
  for (const c of state.filtered) {
    const card = el('article', 'card card-compact');
    const avatar = c.avatar ? `<img class="avatar" src="${c.avatar}" alt="${c.name}" width="40" height="40" decoding="async" loading="lazy"/>` : '';
    const updated = new Date(c.updated_at);
    const updatedStr = isNaN(updated)? '' : updated.toLocaleDateString();
    const typePill = `<span class="type-pill ${c.customer_type==='internal-team'?'internal':'external'}">${c.customer_type==='internal-team'?'Internal':'External'}</span>`;
    const frameworksCount = (c.frameworks||[]).length;
    const servicesCount = (c.services||[]).length;
    const tagsCount = (c.tags||[]).length;
    const membersCount = c.customer_type==='internal-team' ? (c.members||[]).length : 0;
    const next = c.customer_type==='internal-team' ? formatNextMeeting(c.meeting_dates||[]) : '';
    const owner = c.customer_type!=='internal-team' ? (c.account_owner||'') : '';
    const frs = (c.feature_requests||[]);
    const frStatusCounts = ['proposed','under-review','planned','shipped'].map(s => ({ s, n: frs.filter(x => (x.status||'proposed')===s).length }));
    const totalFr = frStatusCounts.reduce((a,b)=>a+b.n,0) || 1;
    const issues = (c.issues||[]);
    const issueSeverityCounts = ['critical','major','minor'].map(s => ({ s, n: issues.filter(x => (x.severity||'minor')===s).length }));
    const totalIssues = issueSeverityCounts.reduce((a,b)=>a+b.n,0) || 1;

    const frBar = frStatusCounts.map(({s,n})=>`<div class="hseg ${s}" style="width:${(n/totalFr)*100}%" title="${s}: ${n}"></div>`).join('');
    const issueBar = issueSeverityCounts.map(({s,n})=>`<div class="hseg ${s}" style="width:${(n/totalIssues)*100}%" title="${s}: ${n}"></div>`).join('');

    const subline = c.customer_type==='internal-team'
      ? `${membersCount} members${next?` · Next: ${next}`:''}`
      : (owner ? `Owner: ${owner}` : '');

    // Determine a concise right-side status for the footer
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    const topPriority = (c.feature_requests||[])
      .map(fr => fr.priority || 'low')
      .sort((a,b)=>(priorityWeights[b]||0)-(priorityWeights[a]||0))[0];
    const asks = Array.isArray(c.asks)? c.asks : [];
    const nextDue = asks
      .map(a => ({...a, _d: new Date(a.due)}))
      .filter(a => a.due && !isNaN(a._d))
      .sort((a,b)=>a._d - b._d)[0];

    const rightStatus = c.customer_type==='internal-team'
      ? (nextDue ? `<span class="tag">Ask: ${nextDue.status||''} · ${nextDue.due}</span>` : (next?`<span class="tag">Next: ${next}</span>`:''))
      : (topPriority ? `<span class="tag priority ${topPriority}">prio: ${topPriority}</span>` : '');

    card.innerHTML = `
      <div class="card-header">
        ${avatar}
        <div class="card-headings">
          <div class="title" title="${c.name}">${c.name}</div>
          <div class="subline" title="${subline}">${subline||'\u00A0'}</div>
        </div>
        ${typePill}
      </div>
      <div class="stat-row">
        <div class="stat" title="Frameworks">
          <span class="ico">${icon('chip')}</span>
          <span class="num">${frameworksCount}</span>
        </div>
        <div class="stat" title="Services">
          <span class="ico">${icon('wrench')}</span>
          <span class="num">${servicesCount}</span>
        </div>
        <div class="stat" title="Tags">
          <span class="ico">${icon('tag')}</span>
          <span class="num">${tagsCount}</span>
        </div>
        ${c.customer_type==='internal-team' ? `
        <div class="stat" title="Members">
          <span class="ico">${icon('users')}</span>
          <span class="num">${membersCount}</span>
        </div>` : ''}
        <div class="spacer"></div>
        ${next ? `<div class="kv mini" title="Next"><span class="k">Next</span><span class="v">${next}</span></div>` : owner ? `<div class="kv mini" title="Owner"><span class="k">Owner</span><span class="v">${owner}</span></div>` : ''}
      </div>
      <div class="microcharts">
        <div class="mrow" title="Feature requests">
          <span class="mlabel">FR</span>
          <div class="hbar">${frBar}</div>
        </div>
        <div class="mrow" title="Issues">
          <span class="mlabel">IS</span>
          <div class="hbar">${issueBar}</div>
        </div>
      </div>
      <div class="footer">
        <div class="foot-left">
          ${updatedStr?`<span class="tag">Updated: ${updatedStr}</span>`:''}
        </div>
        <div class="foot-right">
          ${rightStatus}
          <span class="chev" aria-hidden="true">›</span>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openDetail(c.id));
    frag.appendChild(card);
  }
  grid.appendChild(frag);
}

function formatNextMeeting(dates) {
  const d = dates.map(x=>new Date(x)).filter(x=>!isNaN(x) && x>=new Date()).sort((a,b)=>a-b)[0];
  return d? d.toLocaleDateString() : '';
}

function openDetail(id) {
  const c = state.all.find(x=>x.id===id);
  if (!c) return;
  const modal = $('#detail-modal');
  const detail = $('#detail');
  const tags = (c.tags||[]).map(t=>`<span class="tag">${t}</span>`).join(' ');
  const frList = (c.feature_requests||[]).map(fr=>`<li><strong>${fr.title}</strong> — <em>${fr.status||'proposed'}</em> <span class="tag priority ${fr.priority||''}">${fr.priority||'n/a'}</span></li>`).join('');
  const issueList = (c.issues||[]).map(is=>`<li><strong>${is.title}</strong> — <em>${is.severity||'minor'}</em> <span style="opacity:.7">${is.date||''}</span></li>`).join('');
  const frameworks = (c.frameworks||[]).map(f=>`<span class="tag">${f}</span>`).join(' ');
  const services = (c.services||[]).map(s=>`<span class="tag">${s}</span>`).join(' ');
  const contacts = (c.contacts||[]).map(ct=>`<div>${ct.name||''} <span style="opacity:.6">${ct.role||''}</span> ${ct.email?`<a href="mailto:${ct.email}">${ct.email}</a>`:''}</div>`).join('');
  const members = (c.members||[]).map(m=>`<li>${m.name} <span style="opacity:.7">${m.role||''}</span></li>`).join('');
  const libs = (c.libraries||[]).map(l=>`<li><strong>${l.name}</strong> — <em>${l.project||''}</em></li>`).join('');
  const dates = (c.meeting_dates||[]).map(d=>`<li>${d}</li>`).join('');
  const asks = (c.asks||[]).map(a=>`<li><strong>${a.ask}</strong> — due <em>${a.due||''}</em> <span style="opacity:.7">${a.status||''}</span></li>`).join('');

  // Summaries
  const frs = (c.feature_requests||[]);
  const frStatusCounts = ['proposed','under-review','planned','shipped'].map(s => ({ s, n: frs.filter(x => (x.status||'proposed')===s).length }));
  const totalFr = frStatusCounts.reduce((a,b)=>a+b.n,0) || 1;
  const issues = (c.issues||[]);
  const issueSeverityCounts = ['critical','major','minor'].map(s => ({ s, n: issues.filter(x => (x.severity||'minor')===s).length }));
  const totalIssues = issueSeverityCounts.reduce((a,b)=>a+b.n,0) || 1;
  const nextMeeting = (c.meeting_dates||[]).map(d=>new Date(d)).filter(d=>!isNaN(d) && d>=new Date()).sort((a,b)=>a-b)[0];
  const asksList = (c.asks||[]).slice().sort((a,b)=> new Date(a.due||'2100-01-01') - new Date(b.due||'2100-01-01'));

  const frBar = frStatusCounts.map(({s,n})=>`<div class="hseg ${s}" style="width:${(n/totalFr)*100}%" title="${s}: ${n}"></div>`).join('');
  const issueBar = issueSeverityCounts.map(({s,n})=>`<div class="hseg ${s}" style="width:${(n/totalIssues)*100}%" title="${s}: ${n}"></div>`).join('');

  detail.innerHTML = `
    <div class="detail-header">
      <div style="display:flex; gap:12px; align-items:center;">
        ${c.avatar?`<img src="${c.avatar}" alt="${c.name}" width="56" height="56" decoding="async" style="object-fit:cover; border:1px solid rgba(255,255,255,0.2); clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);"/>`:''}
        <div>
          <h2 style="margin:0">${c.name}</h2>
          <div style="color:var(--muted); font-size:12px;">${c.customer_type||'external'} ${c.account_owner?` · Owner: ${c.account_owner}`:''}</div>
        </div>
      </div>
      <div>${tags}</div>
    </div>
    <div class="detail-wrap">
      <div class="detail-cols">
        <div class="detail-body">
          <div class="section-title">Notes</div>
          <div class="section-box">${c.body_html||'<p style="color:var(--muted)">No notes yet.</p>'}</div>
          ${c.customer_type==='internal-team' ? `
          <div class="section-title">Asks Timeline</div>
          <div class="section-box">
            <ul class="timeline">
              ${asksList.map(a=>`<li><strong>${a.ask}</strong> <span style="opacity:.7">${a.status||''}</span> — due <em>${a.due||''}</em></li>`).join('') || '<li>—</li>'}
            </ul>
          </div>
          <div class="section-title">Meetings</div>
          <div class="section-box">${nextMeeting?`Next: ${nextMeeting.toLocaleString()}`:'—'}</div>
          ` : ''}
        </div>
        <aside class="detail-aside">
          <div class="kv">
            <div class="k">Type</div><div class="v">${c.customer_type||'external'}</div>
            <div class="k">Updated</div><div class="v">${new Date(c.updated_at).toLocaleString()}</div>
            <div class="k">Frameworks</div><div class="v">${frameworks||'—'}</div>
            <div class="k">Services</div><div class="v">${services||'—'}</div>
            <div class="k">Contacts</div><div class="v">${contacts||'—'}</div>
          </div>
          <div class="section-title">Feature Requests</div>
          <div class="section-box">
            <div class="hbar">${frBar}</div>
            <div class="legend">
              <span><span class="dot" style="background:#7a8ca8"></span>Proposed (${frStatusCounts[0].n})</span>
              <span><span class="dot" style="background:var(--neon-2)"></span>Under-review (${frStatusCounts[1].n})</span>
              <span><span class="dot" style="background:var(--cp-cyan)"></span>Planned (${frStatusCounts[2].n})</span>
              <span><span class="dot" style="background:var(--accent)"></span>Shipped (${frStatusCounts[3].n})</span>
            </div>
            <ul style="margin-top:8px">${frList||'<li>—</li>'}</ul>
          </div>
          <div class="section-title">Issues</div>
          <div class="section-box">
            <div class="hbar">${issueBar}</div>
            <div class="legend">
              <span><span class="dot" style="background:var(--cp-red)"></span>Critical (${issueSeverityCounts[0].n})</span>
              <span><span class="dot" style="background:var(--cp-yellow)"></span>Major (${issueSeverityCounts[1].n})</span>
              <span><span class="dot" style="background:#6bcf6b"></span>Minor (${issueSeverityCounts[2].n})</span>
            </div>
            <ul style="margin-top:8px">${issueList||'<li>—</li>'}</ul>
          </div>
          ${c.customer_type==='internal-team' ? `
          <div class="section-title">Members</div>
          <div class="section-box"><ul>${members||'<li>—</li>'}</ul></div>
          <div class="section-title">Libraries</div>
          <div class="section-box"><ul>${libs||'<li>—</li>'}</ul></div>
          ` : ''}
        </aside>
      </div>
    </div>
  `;
  showModal();
}

function bindUI() {
  $('#search').addEventListener('input', (e)=>{
    state.active.query = e.target.value;
    scheduleApplyFilters();
  });
  $('#sort').addEventListener('change', (e)=>{
    state.active.sort = e.target.value;
    scheduleApplyFilters();
  });
  // Performance mode toggle
  const perfBtn = $('#perf-toggle');
  if (perfBtn) {
    const applyPerfPref = () => {
      const enabled = localStorage.getItem('perfMode') === '1';
      document.body.classList.toggle('perf', enabled);
    };
    applyPerfPref();
    perfBtn.addEventListener('click', () => {
      const next = !(localStorage.getItem('perfMode') === '1');
      localStorage.setItem('perfMode', next ? '1' : '0');
      applyPerfPref();
    });
  }
  $('#close-detail').addEventListener('click', closeModal);
  $('#detail-modal').addEventListener('click', (e)=>{
    if (e.target.id === 'detail-modal') closeModal();
  });
  
  // Enhanced keyboard navigation
  window.addEventListener('keydown', (e)=> { 
    if (e.key === 'Escape') {
      if (document.body.classList.contains('sidebar-open')) {
        closeSidebar();
      } else {
        closeModal(); 
      }
    }
  });
  
  // Mobile sidebar functionality
  const mobileToggle = $('#mobile-menu-toggle');
  const sidebar = $('#sidebar');
  const sidebarClose = $('#sidebar-close');
  
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', toggleSidebar);
  }
  
  if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 767 && 
        document.body.classList.contains('sidebar-open') &&
        !sidebar.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
      closeSidebar();
    }
  });
  
  // Touch gesture support for cards
  setupTouchGestures();
  
  // We rely on CSS content-visibility, no IO needed
}

// Batch filter application into the next animation frame
let filterRaf = 0;
function scheduleApplyFilters() {
  if (filterRaf) cancelAnimationFrame(filterRaf);
  filterRaf = requestAnimationFrame(() => { filterRaf = 0; applyFilters(); });
}

function toggleSidebar() {
  const sidebar = $('#sidebar');
  const toggle = $('#mobile-menu-toggle');
  const isOpen = document.body.classList.contains('sidebar-open');
  
  if (isOpen) {
    closeSidebar();
  } else {
    openSidebar();
  }
}

function openSidebar() {
  const sidebar = $('#sidebar');
  const toggle = $('#mobile-menu-toggle');
  
  document.body.classList.add('sidebar-open');
  sidebar.classList.add('active');
  toggle.classList.add('active');
  
  // Add haptic feedback if supported
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}

function closeSidebar() {
  const sidebar = $('#sidebar');
  const toggle = $('#mobile-menu-toggle');
  
  document.body.classList.remove('sidebar-open');
  sidebar.classList.remove('active');
  toggle.classList.remove('active');
}

function setupTouchGestures() {
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  
  document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    if (!e.changedTouches) return;
    
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const endTime = Date.now();
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const deltaTime = endTime - startTime;
    
    // Swipe gestures (only on mobile)
    if (window.innerWidth <= 767 && Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100 && deltaTime < 300) {
      if (deltaX > 0 && startX < 50) {
        // Swipe right from left edge - open sidebar
        openSidebar();
      } else if (deltaX < 0 && document.body.classList.contains('sidebar-open')) {
        // Swipe left when sidebar is open - close sidebar
        closeSidebar();
      }
    }
  }, { passive: true });
}

function setupIntersectionObserver() { /* no-op */ }

function showModal() {
  const modal = $('#detail-modal');
  modal.classList.remove('hidden');
  const mc = modal.querySelector('.modal-content');
  mc.classList.remove('closing');
  mc.classList.remove('anim'); void mc.offsetWidth; mc.classList.add('anim');
  mc.addEventListener('animationend', () => { mc.classList.remove('anim'); }, { once: true });
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = $('#detail-modal');
  if (modal.classList.contains('hidden')) return;
  const mc = modal.querySelector('.modal-content');
  mc.classList.add('closing');
  mc.addEventListener('animationend', () => {
    modal.classList.add('hidden');
    mc.classList.remove('closing');
    document.body.style.overflow = '';
  }, { once: true });
}

window.addEventListener('DOMContentLoaded', async () => {
  bindUI();
  await loadData();
});
