import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './_db.ts';
import { Graduate } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.graduates);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newGraduates = body as Graduate[];
                db.graduates.push(...newGraduates);
                res.status(201).json(newGraduates);
            } else {
                const newGraduate = body as Graduate;
                db.graduates.push(newGraduate);
                res.status(201).json(newGraduate);
            }
            break;
        case 'PUT':
            const updatedGraduate = req.body as Graduate;
            const index = db.graduates.findIndex((g) => g.id === updatedGraduate.id);
            if (index !== -1) {
                db.graduates[index] = updatedGraduate;
                res.status(200).json(updatedGraduate);
            } else {
                res.status(404).json({ message: 'Graduate not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.graduates = db.graduates.filter((g) => g.id !== id);
                res.status(200).json({ message: 'Graduate deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
