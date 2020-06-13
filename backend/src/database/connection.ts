import knex from 'knex';

const connection = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'docker',
    database : 'Ecoleta'
  }
})

export default connection;