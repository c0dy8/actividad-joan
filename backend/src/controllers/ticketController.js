const ticketService = require('../services/ticketService')

async function getAll(req, res) {
  try {
    const tickets = await ticketService.getAllTickets(req.userId)
    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function getById(req, res) {
  try {
    const ticket = await ticketService.getTicketById(Number(req.params.id))
    res.json(ticket)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

async function create(req, res) {
  try {
    const { title, description, priority } = req.body
    if (!title || !description) {
      return res.status(400).json({ message: 'Título y descripción son obligatorios' })
    }
    const ticket = await ticketService.createTicket({
      title,
      description,
      priority: priority || 'MEDIUM',
      userId: req.userId,
    })
    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req, res) {
  try {
    const ticket = await ticketService.updateTicket(Number(req.params.id), req.body)
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req, res) {
  try {
    await ticketService.deleteTicket(Number(req.params.id))
    res.json({ message: 'Ticket eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

async function addComment(req, res) {
  try {
    const { content } = req.body
    if (!content) {
      return res.status(400).json({ message: 'El contenido es obligatorio' })
    }
    const comment = await ticketService.addComment(Number(req.params.id), req.userId, content)
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAll, getById, create, update, remove, addComment }
