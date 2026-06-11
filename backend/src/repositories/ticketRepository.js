const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function findAll(userId) {
  return prisma.ticket.findMany({
    where: { userId },
    include: { user: { select: { name: true } }, comments: true },
    orderBy: { createdAt: 'desc' },
  })
}

async function findById(id) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      comments: { include: { user: { select: { name: true } } } },
    },
  })
}

async function create(data) {
  return prisma.ticket.create({ data })
}

async function update(id, data) {
  return prisma.ticket.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.ticket.delete({ where: { id } })
}

async function createComment(data) {
  return prisma.comment.create({ data })
}

async function getStats() {
  const total = await prisma.ticket.count()
  const open = await prisma.ticket.count({ where: { status: 'OPEN' } })
  const inProgress = await prisma.ticket.count({ where: { status: 'IN_PROGRESS' } })
  const closed = await prisma.ticket.count({ where: { status: 'CLOSED' } })
  return { total, open, inProgress, closed }
}

module.exports = { findAll, findById, create, update, remove, createComment, getStats }
