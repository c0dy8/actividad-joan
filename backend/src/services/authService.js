const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const userRepository = require('../repositories/userRepository')

async function register(name, email, password) {
  const existingUser = await userRepository.findByEmail(email)

  if (existingUser) {
    throw new Error('El email ya está registrado')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await userRepository.createUser({ name, email, password: hashedPassword })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
  return { token, user: { id: user.id, name: user.name, email: user.email } }
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email)

  if (user) {
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
      return { token, user: { id: user.id, name: user.name, email: user.email } }
    } else {
      throw new Error('Credenciales incorrectas')
    }
  } else {
    throw new Error('Credenciales incorrectas')
  }
}

module.exports = { register, login }
