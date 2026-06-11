const authService = require('../services/authService')

async function register(req, res) {
  try {
    const { name, email, password } = req.body

    if (name && email && password) {
      const result = await authService.register(name, email, password)
      res.status(201).json(result)
    } else {
      res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body

    if (email && password) {
      const result = await authService.login(email, password)
      res.json(result)
    } else {
      res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

module.exports = { register, login }
