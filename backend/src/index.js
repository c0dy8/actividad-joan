require('dotenv').config()
const express = require('express')
const cors = require('cors')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

const authRoutes = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const dashboardRoutes = require('./routes/dashboardRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/dashboard', dashboardRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  console.log(`Swagger disponible en http://localhost:${PORT}/api-docs`)
})
