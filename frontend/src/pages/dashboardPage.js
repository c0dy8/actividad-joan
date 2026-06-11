import { getDashboardStats } from '../services/api.js'
import { renderNavbar } from '../components/navbar.js'

export async function dashboardPage() {
  const app = document.getElementById('app')
  renderNavbar()

  app.innerHTML = `<p class="text-center mt-4">Cargando estadísticas...</p>`

  const stats = await getDashboardStats()

  app.innerHTML = `
    <h2 class="mb-4">Dashboard</h2>
    <div class="row g-3">
      <div class="col-md-3">
        <div class="card text-white bg-primary shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Total Tickets</h5>
            <h2>${stats.total}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-info shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Abiertos</h5>
            <h2>${stats.open}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-dark bg-warning shadow">
          <div class="card-body text-center">
            <h5 class="card-title">En Proceso</h5>
            <h2>${stats.inProgress}</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-white bg-success shadow">
          <div class="card-body text-center">
            <h5 class="card-title">Cerrados</h5>
            <h2>${stats.closed}</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <a href="#tickets" class="btn btn-primary">Ver Tickets</a>
      <a href="#tickets/new" class="btn btn-success ms-2">Crear Ticket</a>
    </div>
  `
}
