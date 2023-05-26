import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import crypto from 'node:crypto'
import { knex } from '../database'
import { checkUserAreadyExist } from '../middleware/check-user-aready-exist'

export async function dietRoutes(app: FastifyInstance) {
  // Validação de qual usuario é utilizar preHandler

  // Criar refeição relacionando com o usuario
  app.post(
    '/',
    {
      preHandler: [checkUserAreadyExist],
    },
    async (request, reply) => {
      const userId = request.cookies.userId
      const dietId = crypto.randomUUID()

      const createDietShema = z.object({
        description: z.string(),
        diaMesAno: z.string(),
        hora: z.string(),
        onDiet: z.boolean(),
      })

      const { description, diaMesAno, hora, onDiet } = createDietShema.parse(
        request.body,
      )

      await knex('diet').insert({
        id: dietId,
        description,
        diaMesAno,
        hora,
        onDiet,
        userId,
      })

      return reply.status(201).send('Diet Created')
    },
  )
  // Editar uma refeição
  app.put('/:id', async (request, reply) => {
    const updateDietShema = z.object({
      id: z.string().uuid(),
    })
    const updateDietSchemaBody = z.object({
      description: z.string(),
      diaMesAno: z.string(),
      hora: z.string(),
      onDiet: z.boolean(),
    })

    const { description, diaMesAno, hora, onDiet } = updateDietSchemaBody.parse(
      request.body,
    )
    const { id } = updateDietShema.parse(request.params)

    const updatedDiet = await knex('diet')
      .update({
        description,
        diaMesAno,
        hora,
        onDiet,
      })
      .where('id', id)
      .returning('*')

    return { updatedDiet }
  })
  // Deletar uma refeição
  app.delete('/:id', async (request, reply) => {
    const getdietsParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getdietsParamsSchema.parse(request.params)

    const diets = await knex('diet').delete('*').where('id', id)

    return { diets }
  })
  // Listar refeição de um usuario
  app.get('/', async (request, reply) => {
    const userId = request.cookies.userId

    const diets = await knex('diet').select('*').where('userId', userId)

    return { diets }
  })
  // Listar apenas uma refeição
  app.get('/:id', async (request, reply) => {
    const getdietsParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getdietsParamsSchema.parse(request.params)

    const diets = await knex('diet').select('*').where('id', id)

    return { diets }
  })
}
