export function renderNavbar() {
  const container = document.getElementById('navbar-container')
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  if (!token) {
    container.innerHTML = ''
    return
  }

  container.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" href="#dashboard">AI Support Desk</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="#dashboard">Dashboard</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#tickets">Tickets</a>
            </li>
          </ul>
          <span class="navbar-text me-3 text-white">Hola, ${user.name || 'Usuario'}</span>
          <button class="btn btn-outline-light btn-sm" id="logout-btn">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  `

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.hash = '#login'
  })
}
