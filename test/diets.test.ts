import { beforeAll, afterAll, describe, it, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Diet', () => {
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

  it('Should be create a diet for a one user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/diets')
      .set('Cookie', cookie)
      .send({
        description: 'fit',
        diaMesAno: '28/03/2023',
        hora: '13:00',
        onDiet: true,
      })
      .expect(201)
  })

  it('Should be show a list of diets for a user', async () => {
    const createDietResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createDietResponse.get('Set-Cookie')
    await request(app.server).get('/diets').set('Cookie', cookie).expect(200)
  })

  it('Should be view a diet for a diet_ID ', async () => {
    const createDietResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createDietResponse.get('Set-Cookie')
    await request(app.server).post('/diets').set('Cookie', cookie).send({
      description: 'fit',
      diaMesAno: '28/03/2023',
      hora: '13:00',
      onDiet: true,
    })

    const getDietId = await request(app.server)
      .get('/diets')
      .set('Cookie', cookie)
      .expect(200)

    const dietId = getDietId.body.diets[0].id

    await request(app.server).get(`/diets/${dietId}`).expect(200)
  })

  it.skip('Should be delete a diet with dietId', async () => {
    const createDietResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createDietResponse.get('Set-Cookie')
    await request(app.server).post('/diets').set('Cookie', cookie).send({
      description: 'fit',
      diaMesAno: '28/03/2023',
      hora: '13:00',
      onDiet: true,
    })

    const getDietId = await request(app.server)
      .get('/diets')
      .set('Cookie', cookie)
      .expect(200)

    const dietId = getDietId.body.diets[0].id
    console.log(dietId)

    await request(app.server)
      .delete(`/diets/${dietId}`)
      .set('Cookie', cookie)
      .expect(204)
  })

  it.skip('Should be updated a diet with dietId', async () => {
    const createDietResponse = await request(app.server).post('/users').send({
      name: 'Jorge Skonicezny',
      email: 'renan@skonicezny',
      password: '123456',
    })

    const cookie = createDietResponse.get('Set-Cookie')
    await request(app.server).post('/diets').set('Cookie', cookie).send({
      description: 'fit',
      diaMesAno: '28/03/2023',
      hora: '13:00',
      onDiet: true,
    })

    const getDietId = await request(app.server)
      .get('/diets')
      .set('Cookie', cookie)
      .expect(200)

    const dietId = getDietId.body.diets[0].id

    console.log(getDietId.text)

    await request(app.server)
      .put(`/diets/${dietId}`)
      .set('Cookie', cookie)
      .send({
        description: 'Apenas feijao',
        diaMesAno: '17/03/2023',
        hora: '13:30',
        onDiet: true,
      })
  })
})
