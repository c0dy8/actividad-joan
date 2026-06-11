import { loginPage } from './pages/loginPage.js'
import { registerPage } from './pages/registerPage.js'
import { dashboardPage } from './pages/dashboardPage.js'
import { ticketsPage, newTicketPage, ticketDetailPage } from './pages/ticketsPage.js'

function isLoggedIn() {
  const token = localStorage.getItem('token')
  if (token) {
    return true
  } else {
    return false
  }
}

function router() {
  const hash = window.location.hash || '#login'

  if (isLoggedIn()) {
    if (hash === '#login' || hash === '#register') {
      window.location.hash = '#dashboard'
    } else if (hash === '#dashboard') {
      dashboardPage()
    } else if (hash === '#tickets') {
      ticketsPage()
    } else if (hash === '#tickets/new') {
      newTicketPage()
    } else if (hash.startsWith('#tickets/')) {
      const id = parseInt(hash.split('/')[1])
      ticketDetailPage(id)
    } else {
      window.location.hash = '#dashboard'
    }
  } else {
    if (hash === '#register') {
      registerPage()
    } else {
      loginPage()
    }
  }
}

window.addEventListener('hashchange', router)
router()
