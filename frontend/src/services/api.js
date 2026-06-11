const BASE_URL = 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  }
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return res.json()
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return res.json()
}

export async function getTickets() {
  const res = await fetch(`${BASE_URL}/tickets`, { headers: getHeaders() })
  return res.json()
}

export async function getTicket(id) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, { headers: getHeaders() })
  return res.json()
}

export async function createTicket(data) {
  const res = await fetch(`${BASE_URL}/tickets`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updateTicket(id, data) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function deleteTicket(id) {
  const res = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  })
  return res.json()
}

export async function addComment(ticketId, content) {
  const res = await fetch(`${BASE_URL}/tickets/${ticketId}/comments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ content }),
  })
  return res.json()
}

export async function getDashboardStats() {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, { headers: getHeaders() })
  return res.json()
}
