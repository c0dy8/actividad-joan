const jwt = require('jsonwebtoken')

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.userId = decoded.userId
      next()
    } catch (error) {
      res.status(401).json({ message: 'Token inválido' })
    }
  } else {
    res.status(401).json({ message: 'Token requerido' })
  }
}

module.exports = authMiddleware
