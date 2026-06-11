const express = require('express')
const router = express.Router()
const ticketController = require('../controllers/ticketController')
const authMiddleware = require('../middleware/auth')

router.use(authMiddleware)

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtener todos los tickets del usuario
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets
 */
router.get('/', ticketController.getAll)

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Obtener un ticket por ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:id', ticketController.getById)

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crear un nuevo ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       201:
 *         description: Ticket creado
 */
router.post('/', ticketController.create)

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Actualizar un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, CLOSED]
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       200:
 *         description: Ticket actualizado
 */
router.put('/:id', ticketController.update)

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Eliminar un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ticket eliminado
 */
router.delete('/:id', ticketController.remove)

/**
 * @swagger
 * /api/tickets/{id}/comments:
 *   post:
 *     summary: Agregar un comentario a un ticket
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content]
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario agregado
 */
router.post('/:id/comments', ticketController.addComment)

module.exports = router
