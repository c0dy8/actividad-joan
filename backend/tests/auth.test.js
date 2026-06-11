const request = require('supertest')
const app = require('../src/app')

// Mockeamos el repositorio para no necesitar base de datos
jest.mock('../src/repositories/userRepository', () => ({
  findByEmail: jest.fn(),
  createUser: jest.fn(),
  findById: jest.fn(),
}))

const userRepository = require('../src/repositories/userRepository')

describe('Auth - POST /api/auth/register', () => {
  beforeEach(() => jest.clearAllMocks())

  test('registra un usuario correctamente', async () => {
    userRepository.findByEmail.mockResolvedValue(null)
    userRepository.createUser.mockResolvedValue({ id: 1, name: 'Juan', email: 'juan@test.com' })

    const res = await request(app).post('/api/auth/register').send({
      name: 'Juan',
      email: 'juan@test.com',
      password: '123456',
    })

    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('juan@test.com')
  })

  test('falla si faltan campos', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'juan@test.com',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Todos los campos son obligatorios')
  })

  test('falla si el email ya está registrado', async () => {
    userRepository.findByEmail.mockResolvedValue({ id: 1, email: 'juan@test.com' })

    const res = await request(app).post('/api/auth/register').send({
      name: 'Juan',
      email: 'juan@test.com',
      password: '123456',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('El email ya está registrado')
  })
})

describe('Auth - POST /api/auth/login', () => {
  const bcrypt = require('bcryptjs')

  beforeEach(() => jest.clearAllMocks())

  test('hace login correctamente', async () => {
    const hashedPassword = await bcrypt.hash('123456', 10)
    userRepository.findByEmail.mockResolvedValue({
      id: 1,
      name: 'Juan',
      email: 'juan@test.com',
      password: hashedPassword,
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'juan@test.com',
      password: '123456',
    })

    expect(res.status).toBe(200)
    expect(res.body.token).toBeDefined()
    expect(res.body.user.email).toBe('juan@test.com')
  })

  test('falla si el usuario no existe', async () => {
    userRepository.findByEmail.mockResolvedValue(null)

    const res = await request(app).post('/api/auth/login').send({
      email: 'noexiste@test.com',
      password: '123456',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  test('falla si la contraseña es incorrecta', async () => {
    const hashedPassword = await bcrypt.hash('correcta', 10)
    userRepository.findByEmail.mockResolvedValue({
      id: 1,
      email: 'juan@test.com',
      password: hashedPassword,
    })

    const res = await request(app).post('/api/auth/login').send({
      email: 'juan@test.com',
      password: 'incorrecta',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Credenciales incorrectas')
  })

  test('falla si faltan campos', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'juan@test.com',
    })

    expect(res.status).toBe(400)
    expect(res.body.message).toBe('Email y contraseña son obligatorios')
  })
})
