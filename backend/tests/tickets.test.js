const request = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../src/app')

jest.mock('../src/repositories/ticketRepository', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  createComment: jest.fn(),
  getStats: jest.fn(),
}))

const ticketRepository = require('../src/repositories/ticketRepository')

// Generamos un token válido para las peticiones protegidas
const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'mysecretkey123')
const authHeader = `Bearer ${token}`

const ticketMock = {
  id: 1,
  title: 'Bug en login',
  description: 'No puedo iniciar sesión',
  status: 'OPEN',
  priority: 'HIGH',
  userId: 1,
  comments: [],
  user: { name: 'Juan' },
}

describe('Tickets - GET /api/tickets', () => {
  beforeEach(() => jest.clearAllMocks())

  test('devuelve la lista de tickets del usuario', async () => {
    ticketRepository.findAll.mockResolvedValue([ticketMock])

    const res = await request(app).get('/api/tickets').set('Authorization', authHeader)

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
    expect(res.body[0].title).toBe('Bug en login')
  })

  test('rechaza sin token', async () => {
    const res = await request(app).get('/api/tickets')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token requerido')
  })
})

describe('Tickets - GET /api/tickets/:id', () => {
  beforeEach(() => jest.clearAllMocks())

  test('devuelve un ticket por ID', async () => {
    ticketRepository.findById.mockResolvedValue(ticketMock)

    const res = await request(app).get('/api/tickets/1').set('Authorization', authHeader)

    expect(res.status).toBe(200)
    expect(res.body.id).toBe(1)
  })

  test('devuelve 404 si el ticket no existe', async () => {
    ticketRepository.findById.mockResolvedValue(null)

    const res = await request(app).get('/api/tickets/999').set('Authorization', authHeader)

    expect(res.status).toBe(404)
    expect(res.body.message).toBe('Ticket no encontrado')
  })
})

describe('Tickets - POST /api/tickets', () => {
  beforeEach(() => jest.clearAllMocks())

  test('crea un ticket correctamente', async () => {
    ticketRepository.create.mockResolvedValue(ticketMock)

    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', authHeader)
      .send({ title: 'Bug en login', description: 'No puedo iniciar sesión', priority: 'HIGH' })

    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Bug en login')
  })

  test('falla si faltan título o descripción', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', authHeader)
      .send({ title: 'Solo título' })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Título y descripción son obligatorios')
  })
})

describe('Tickets - PUT /api/tickets/:id', () => {
  beforeEach(() => jest.clearAllMocks())

  test('actualiza el estado de un ticket', async () => {
    const updated = { ...ticketMock, status: 'CLOSED' }
    ticketRepository.update.mockResolvedValue(updated)

    const res = await request(app)
      .put('/api/tickets/1')
      .set('Authorization', authHeader)
      .send({ status: 'CLOSED' })

    expect(res.status).toBe(200)
    expect(res.body.status).toBe('CLOSED')
  })
})

describe('Tickets - DELETE /api/tickets/:id', () => {
  beforeEach(() => jest.clearAllMocks())

  test('elimina un ticket', async () => {
    ticketRepository.remove.mockResolvedValue(ticketMock)

    const res = await request(app)
      .delete('/api/tickets/1')
      .set('Authorization', authHeader)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Ticket eliminado')
  })
})

describe('Tickets - POST /api/tickets/:id/comments', () => {
  beforeEach(() => jest.clearAllMocks())

  test('agrega un comentario a un ticket', async () => {
    ticketRepository.createComment.mockResolvedValue({
      id: 1,
      content: 'Revisando el problema',
      ticketId: 1,
      userId: 1,
    })

    const res = await request(app)
      .post('/api/tickets/1/comments')
      .set('Authorization', authHeader)
      .send({ content: 'Revisando el problema' })

    expect(res.status).toBe(201)
    expect(res.body.content).toBe('Revisando el problema')
  })

  test('falla si el contenido está vacío', async () => {
    const res = await request(app)
      .post('/api/tickets/1/comments')
      .set('Authorization', authHeader)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('El contenido es obligatorio')
  })
})
