import { getTickets, getTicket, createTicket, updateTicket, deleteTicket, addComment } from '../services/api.js'
import { renderNavbar } from '../components/navbar.js'

const STATUS_LABELS = { OPEN: 'Abierto', IN_PROGRESS: 'En Proceso', CLOSED: 'Cerrado' }
const PRIORITY_LABELS = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }

function getStatusColor(status) {
  let color = 'bg-secondary'

  if (status === 'OPEN') {
    color = 'bg-primary'
  } else if (status === 'IN_PROGRESS') {
    color = 'bg-warning text-dark'
  } else if (status === 'CLOSED') {
    color = 'bg-success'
  }

  return color
}

export async function ticketsPage() {
  renderNavbar()
  const app = document.getElementById('app')
  app.innerHTML = `<p class="text-center mt-4">Cargando tickets...</p>`

  const tickets = await getTickets()

  let ticketsHtml = ''

  if (tickets.length === 0) {
    ticketsHtml = '<p class="text-muted">No tienes tickets aún. ¡Crea uno!</p>'
  } else {
    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i]
      ticketsHtml += `
        <div class="card mb-3 ticket-card shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-1">
                <a href="#tickets/${ticket.id}" class="text-decoration-none text-dark">${ticket.title}</a>
              </h5>
              <div>
                <span class="badge bg-secondary me-1">${PRIORITY_LABELS[ticket.priority]}</span>
                <span class="badge ${getStatusColor(ticket.status)}">${STATUS_LABELS[ticket.status]}</span>
              </div>
            </div>
            <p class="text-muted mb-1 small">${ticket.description.substring(0, 100)}...</p>
            <small class="text-muted">
              ${ticket.comments.length} comentario(s) · ${new Date(ticket.createdAt).toLocaleDateString()}
            </small>
          </div>
        </div>
      `
    }
  }

  app.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Mis Tickets</h2>
      <a href="#tickets/new" class="btn btn-success">+ Nuevo Ticket</a>
    </div>
    ${ticketsHtml}
  `
}

export function newTicketPage() {
  const app = document.getElementById('app')
  renderNavbar()

  app.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h2 class="mb-4">Crear Ticket</h2>
        <div id="error-msg" class="alert alert-danger d-none"></div>
        <form id="ticket-form" class="card p-4 shadow">
          <div class="mb-3">
            <label class="form-label">Título</label>
            <input type="text" class="form-control" id="title" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Descripción</label>
            <textarea class="form-control" id="description" rows="4" required></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Prioridad</label>
            <select class="form-select" id="priority">
              <option value="LOW">Baja</option>
              <option value="MEDIUM" selected>Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>
          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-success">Crear Ticket</button>
            <a href="#tickets" class="btn btn-secondary">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `

  document.getElementById('ticket-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const priority = document.getElementById('priority').value

    const result = await createTicket({ title, description, priority })

    if (result.id) {
      window.location.hash = '#tickets'
    } else {
      const errorDiv = document.getElementById('error-msg')
      errorDiv.textContent = result.message || 'Error al crear el ticket'
      errorDiv.classList.remove('d-none')
    }
  })
}

export async function ticketDetailPage(id) {
  const app = document.getElementById('app')
  renderNavbar()

  app.innerHTML = `<p class="text-center mt-4">Cargando ticket...</p>`

  const ticket = await getTicket(id)

  if (ticket.id) {
    let commentsHtml = ''

    if (ticket.comments.length === 0) {
      commentsHtml = '<p class="text-muted">Sin comentarios aún</p>'
    } else {
      for (let i = 0; i < ticket.comments.length; i++) {
        const c = ticket.comments[i]
        commentsHtml += `
          <div class="border-bottom py-2">
            <strong>${c.user.name}</strong>
            <small class="text-muted ms-2">${new Date(c.createdAt).toLocaleDateString()}</small>
            <p class="mb-0">${c.content}</p>
          </div>
        `
      }
    }

    app.innerHTML = `
      <div class="row">
        <div class="col-md-8">
          <div class="card shadow mb-3">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start">
                <h3>${ticket.title}</h3>
                <div>
                  <span class="badge bg-secondary me-1">${PRIORITY_LABELS[ticket.priority]}</span>
                  <span class="badge ${getStatusColor(ticket.status)}">${STATUS_LABELS[ticket.status]}</span>
                </div>
              </div>
              <p class="text-muted">Creado por ${ticket.user.name}</p>
              <p>${ticket.description}</p>
              <div class="mt-3">
                <label class="form-label fw-bold">Cambiar estado</label>
                <div class="d-flex gap-2 align-items-center">
                  <select class="form-select w-auto" id="status-select">
                    <option value="OPEN" ${ticket.status === 'OPEN' ? 'selected' : ''}>Abierto</option>
                    <option value="IN_PROGRESS" ${ticket.status === 'IN_PROGRESS' ? 'selected' : ''}>En Proceso</option>
                    <option value="CLOSED" ${ticket.status === 'CLOSED' ? 'selected' : ''}>Cerrado</option>
                  </select>
                  <button class="btn btn-primary btn-sm" id="update-status-btn">Actualizar</button>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow">
            <div class="card-body">
              <h5>Comentarios (${ticket.comments.length})</h5>
              <div id="comments-list">
                ${commentsHtml}
              </div>
              <form id="comment-form" class="mt-3">
                <div class="mb-2">
                  <textarea class="form-control" id="comment-content" rows="2" placeholder="Agregar comentario..."></textarea>
                </div>
                <button type="submit" class="btn btn-outline-primary btn-sm">Comentar</button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow">
            <div class="card-body">
              <h6>Acciones</h6>
              <a href="#tickets" class="btn btn-secondary btn-sm w-100 mb-2">Volver a Tickets</a>
              <button class="btn btn-danger btn-sm w-100" id="delete-btn">Eliminar Ticket</button>
            </div>
          </div>
        </div>
      </div>
    `

    document.getElementById('update-status-btn').addEventListener('click', async () => {
      const status = document.getElementById('status-select').value
      await updateTicket(id, { status })
      window.location.hash = `#tickets/${id}`
    })

    document.getElementById('comment-form').addEventListener('submit', async (e) => {
      e.preventDefault()
      const content = document.getElementById('comment-content').value

      if (content.trim()) {
        await addComment(id, content)
        window.location.hash = `#tickets/${id}`
      }
    })

    document.getElementById('delete-btn').addEventListener('click', async () => {
      if (confirm('¿Seguro que quieres eliminar este ticket?')) {
        await deleteTicket(id)
        window.location.hash = '#tickets'
      }
    })
  } else {
    app.innerHTML = `<p class="text-danger">Ticket no encontrado</p>`
  }
}
