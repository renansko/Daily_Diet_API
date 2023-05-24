import { FastifyInstance } from 'fastify'

export async function usersRoutes(app: FastifyInstance) {
  // Metricas de usuario
  app.get('/', async (request, reply) => {
    return { hello: 'world' }
  })
  // Criar usuario -> Salvando o cookie
  app.post('/', async (request, reply) => {
    return { hello: 'world' }
  })
}
