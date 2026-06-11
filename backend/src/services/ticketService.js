const ticketRepository = require('../repositories/ticketRepository')

async function getAllTickets(userId) {
  return ticketRepository.findAll(userId)
}

async function getTicketById(id) {
  const ticket = await ticketRepository.findById(id)
  if (!ticket) throw new Error('Ticket no encontrado')
  return ticket
}

async function createTicket(data) {
  return ticketRepository.create(data)
}

async function updateTicket(id, data) {
  return ticketRepository.update(id, data)
}

async function deleteTicket(id) {
  return ticketRepository.remove(id)
}

async function addComment(ticketId, userId, content) {
  return ticketRepository.createComment({ ticketId, userId, content })
}

module.exports = { getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket, addComment }
