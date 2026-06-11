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

const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET || 'mysecretkey123')
const authHeader = `Bearer ${token}`

describe('Dashboard - GET /api/dashboard/stats', () => {
  beforeEach(() => jest.clearAllMocks())

  test('devuelve las estadísticas correctamente', async () => {
    ticketRepository.getStats.mockResolvedValue({
      total: 10,
      open: 5,
      inProgress: 3,
      closed: 2,
    })

    const res = await request(app)
      .get('/api/dashboard/stats')
      .set('Authorization', authHeader)

    expect(res.status).toBe(200)
    expect(res.body.total).toBe(10)
    expect(res.body.open).toBe(5)
    expect(res.body.inProgress).toBe(3)
    expect(res.body.closed).toBe(2)
  })

  test('rechaza sin token', async () => {
    const res = await request(app).get('/api/dashboard/stats')

    expect(res.status).toBe(401)
    expect(res.body.message).toBe('Token requerido')
  })
})
