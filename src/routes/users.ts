import { FastifyInstance } from 'fastify'
import crypto from 'node:crypto'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserAreadyExist } from '../middleware/check-user-aready-exist'

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
  app.get(
    '/',
    {
      preHandler: [checkUserAreadyExist],
    },
    async (request, reply) => {
      const users = await knex('users').select('*')

      return { users }
    },
  )
  // Metricas de usuario
  app.get('/:id', async (request, reply) => {
    const updateDietShema = z.object({
      id: z.string().uuid(),
    })

    const { id } = updateDietShema.parse(request.params)

    const diets = await knex('diet').select('*').where('userId', id)

    let amountSnack = 0
    let totalAmountOnDietSnack = 0
    let totalAmountOffDiet = 0
    let bestSequenceOnDiet = 0
    let acc = 0

    diets.map((dateString) => {
      if (acc <= bestSequenceOnDiet) {
        acc = bestSequenceOnDiet
      }
      if (dateString.onDiet) {
        bestSequenceOnDiet++
      } else {
        bestSequenceOnDiet = 0
      }
      return acc
    })

    diets.forEach((element) => {
      if (element.onDiet) {
        totalAmountOnDietSnack++
      } else {
        totalAmountOffDiet++
      }
      amountSnack++
    })

    const metris = {
      user: id,
      amountSnack,
      totalAmountOnDietSnack,
      totalAmountOffDiet,
      bestSequenceOnDiet: acc,
    }

    return { metris }
  })
}
