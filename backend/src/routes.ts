import express from 'express';
import knex from './database/connection';

const routes = express.Router();

routes.get('/items', async (request, response) => {
  const items = await knex('items').select("*");

  const serializedItems = items.map(item => {
    return {
      id: item.id,
      title: item.title,
      image_url: `http://192.168.0.45:3333/uploads/${item.image}`,
    };
  });

  response.json(serializedItems);
})

export default routes;