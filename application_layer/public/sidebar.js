// Sidebar Navigation Component
function createSidebar(activePage) {
  const sidebarHTML = `
    <button class="sidebar-toggle" onclick="toggleSidebar()">☰</button>
    <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
    
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <h1 class="sidebar-title">Application Layer</h1>
        <p class="sidebar-subtitle">OSI Layer 7 Simulation</p>
      </div>

      <nav>
        <ul class="sidebar-nav">
          <li class="sidebar-nav-item">
            <a href="/" class="sidebar-nav-link ${activePage === 'composer' ? 'active' : ''}">
              <span class="sidebar-nav-icon">📝</span>
              <span>Message Composer</span>
            </a>
          </li>
          
          <li class="sidebar-nav-item">
            <a href="/queue" class="sidebar-nav-link ${activePage === 'queue' ? 'active' : ''}">
              <span class="sidebar-nav-icon">📋</span>
              <span>Message Queue</span>
            </a>
          </li>

          <div class="sidebar-section">Transfer & History</div>

          <li class="sidebar-nav-item">
            <a href="/transfer" class="sidebar-nav-link ${activePage === 'transfer' ? 'active' : ''}">
              <span class="sidebar-nav-icon">🔄</span>
              <span>File Transfer</span>
            </a>
          </li>

          <li class="sidebar-nav-item">
            <a href="/outbox" class="sidebar-nav-link ${activePage === 'outbox' ? 'active' : ''}">
              <span class="sidebar-nav-icon">📦</span>
              <span>Transfer History</span>
            </a>
          </li>

          <div class="sidebar-section">Presentation Layer</div>

          <li class="sidebar-nav-item">
            <a href="/presentation-test" class="sidebar-nav-link ${activePage === 'presentation-post' ? 'active' : ''}">
              <span class="sidebar-nav-icon">📤</span>
              <span>POST Test</span>
            </a>
          </li>

          <li class="sidebar-nav-item">
            <a href="/test-get-presentation" class="sidebar-nav-link ${activePage === 'presentation-get' ? 'active' : ''}">
              <span class="sidebar-nav-icon">📥</span>
              <span>GET Test</span>
            </a>
          </li>
        </ul>
      </nav>

      <div class="sidebar-footer">
        <div>v1.0.0 • Node.js Application Layer</div>
        <div style="margin-top: 4px;">Port: 3000</div>
      </div>
    </aside>
  `;

  return sidebarHTML;
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
  }
}

// Auto-close sidebar on navigation (mobile)
if (window.innerWidth <= 768) {
  document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.sidebar-toggle');
    
    if (sidebar && toggle && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
      document.querySelector('.sidebar-overlay')?.classList.remove('show');
    }
  });
}
