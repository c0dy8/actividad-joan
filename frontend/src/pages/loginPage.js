import { login } from '../services/api.js'
import { renderNavbar } from '../components/navbar.js'

export function loginPage() {
  const app = document.getElementById('app')
  renderNavbar()

  app.innerHTML = `
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h3 class="card-title text-center mb-4">Iniciar Sesión</h3>
            <div id="error-msg" class="alert alert-danger d-none"></div>
            <form id="login-form">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Contraseña</label>
                <input type="password" class="form-control" id="password" required />
              </div>
              <button type="submit" class="btn btn-primary w-100">Entrar</button>
            </form>
            <p class="text-center mt-3">
              ¿No tienes cuenta? <a href="#register">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const result = await login(email, password)

    if (result.token) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
      window.location.hash = '#dashboard'
    } else {
      const errorDiv = document.getElementById('error-msg')
      errorDiv.textContent = result.message || 'Error al iniciar sesión'
      errorDiv.classList.remove('d-none')
    }
  })
}
