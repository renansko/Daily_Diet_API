// eslint-disable-next-line
import { UUID } from 'crypto'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: UUID
      name: string
      password: string
      email: string
      created_at: string
      updated_at: string
      dietIds: string
    }
    diet: {
      id: string
      description: string
      diaMesAno: string
      hora: string
      onDiet: boolean
      created_at: string
      updated_at: string
      userId: string
    }
  }
}
