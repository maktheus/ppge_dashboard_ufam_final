import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './_db';
import { Periodico } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.periodicos);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newPeriodicos = body as Periodico[];
                db.periodicos.push(...newPeriodicos);
                res.status(201).json(newPeriodicos);
            } else {
                const newPeriodico = body as Periodico;
                db.periodicos.push(newPeriodico);
                res.status(201).json(newPeriodico);
            }
            break;
        case 'PUT':
            const updatedPeriodico = req.body as Periodico;
            const index = db.periodicos.findIndex((p) => p.id === updatedPeriodico.id);
            if (index !== -1) {
                db.periodicos[index] = updatedPeriodico;
                res.status(200).json(updatedPeriodico);
            } else {
                res.status(404).json({ message: 'Periodico not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.periodicos = db.periodicos.filter((p) => p.id !== id);
                res.status(200).json({ message: 'Periodico deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
