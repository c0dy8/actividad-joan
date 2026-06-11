const ticketRepository = require('../repositories/ticketRepository')

async function getStats() {
  return ticketRepository.getStats()
}

module.exports = { getStats }
