import { FastifyInstance } from 'fastify'

export async function dietRoutes(app: FastifyInstance) {
  // Validação de qual usuario é utilizar preHandler

  // Criar refeição relacionando com o usuario
  app.post('/', async (request, reply) => {
    return { message: 'ok' }
  })
  // Editar uma refeição
  app.put('/', async (request, reply) => {
    return { message: 'ok' }
  })
  // Deletar uma refeição
  app.delete('/', async (request, reply) => {
    return { message: 'ok' }
  })
  // Listar refeição de um usuario
  app.get('/', async (request, reply) => {
    return { message: 'ok' }
  })
  // Listar apenas uma refeição
  app.get('/:id', async (request, reply) => {
    return { message: 'ok' }
  })
}
