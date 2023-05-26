import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  // Criar usuario -> Salvando o cookie
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const userId = crypto.randomUUID()

    reply.cookie('userId', userId, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    const { name, email, password } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: userId,
      name,
      email,
      password,
    })

    return reply.status(201).send('User created')
  })
  // Metricas de usuario
  app.get('/', async (request, reply) => {
    const usersMetrics = await knex('users').select('*')

    return { usersMetrics }
  })
}
