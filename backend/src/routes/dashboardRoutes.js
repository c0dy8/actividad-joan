const express = require('express')
const router = express.Router()
const dashboardController = require('../controllers/dashboardController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     summary: Obtener estadísticas del dashboard
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de tickets
 */
router.get('/stats', dashboardController.getStats)

module.exports = router
