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

routes.post('/points', async (request, response) => {
  const {
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
    items
  } = request.body;

  const trx = await knex.transaction();

  const point = {
    image: 'fake-image',
    name,
    email,
    whatsapp,
    latitude,
    longitude,
    city,
    uf,
  }

  const insertedIds = await trx('points').returning('id').insert(point);

  const point_id = insertedIds[0];

  const pointItems = items
    .split(',')
    .map((item: string) => Number(item.trim()))
    .map((item_id: number) => {
    return {
      item_id,
      point_id
    }
  });

 await trx('point_items').insert(pointItems)

 await trx.commit();

  return response.json({ 
    id: point_id,
    ...point
  });
})

export default routes;
