import { register } from '../services/api.js'
import { renderNavbar } from '../components/navbar.js'

export function registerPage() {
  const app = document.getElementById('app')
  renderNavbar()

  app.innerHTML = `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">Crear Cuenta</h3>
            <div id="error-msg" class="alert alert-danger d-none"></div>
            <form id="register-form">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" id="name" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" required />
              </div>
              <button type="submit" class="btn btn-success w-100">Registrarse</button>
            </form>
            <p class="text-center mt-3">
              ¿Ya tienes cuenta? <a href="#login">Inicia sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const result = await register(name, email, password)

    if (result.token) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      window.location.hash = '#dashboard'
    } else {
      const errorDiv = document.getElementById('error-msg')
      errorDiv.textContent = result.message || 'Error al registrarse'
      errorDiv.classList.remove('d-none')
    }
  })
}
