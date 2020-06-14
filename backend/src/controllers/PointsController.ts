import { Request, Response} from 'express';
import knex from '../database/connection';

export default class PointsController {
  async create (request: Request, response: Response) {
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
  }

  async show (request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({ message: 'Point not found.' });
    }

    const serializedPoint = {
        ...point,
        latitude: Number(point.latitude),
        longitude: Number(point.longitude),
        image_url: `http://192.168.0.45:3333/uploads/${point.image}`,
    };

    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title');

    return response.json({point: serializedPoint, items});
  }
}