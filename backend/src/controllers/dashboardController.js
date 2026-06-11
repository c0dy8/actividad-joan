const dashboardService = require('../services/dashboardService')

async function getStats(req, res) {
  try {
    const stats = await dashboardService.getStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getStats }
