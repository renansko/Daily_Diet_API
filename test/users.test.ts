import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Users', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be create an new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Jorge Skonicezny',
        email: 'renan@skonicezny',
        password: '123456',
      })
      .expect(201)
  })

  it('Should be list a metric off Expecific user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createUserResponse.get('Set-Cookie')
    const userIdOnCookie = await request(app.server)
      .get('/users')
      .set('Cookie', cookie)
      .expect(200)

    const userId = userIdOnCookie.body.users[0].id
    await request(app.server)
      .get(`/users/${userId}`)
      .set('Cookie', cookie)
      .expect(200)
  })
})
