import { loginPage } from './pages/loginPage.js'
import { registerPage } from './pages/registerPage.js'
import { dashboardPage } from './pages/dashboardPage.js'
import { ticketsPage, newTicketPage, ticketDetailPage } from './pages/ticketsPage.js'

function isLoggedIn() {
  return !!localStorage.getItem('token')
}

function router() {
  const hash = window.location.hash || '#login'

  if (!isLoggedIn() && hash !== '#login' && hash !== '#register') {
    window.location.hash = '#login'
    return
  }

  if (isLoggedIn() && (hash === '#login' || hash === '#register')) {
    window.location.hash = '#dashboard'
    return
  }

  if (hash === '#login') {
    loginPage()
  } else if (hash === '#register') {
    registerPage()
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
    window.location.hash = '#login'
  }
}

window.addEventListener('hashchange', router)
router()
