import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './_db';
import { Docente } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.docentes);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newDocentes = body as Docente[];
                db.docentes.push(...newDocentes);
                res.status(201).json(newDocentes);
            } else {
                const newDocente = body as Docente;
                db.docentes.push(newDocente);
                res.status(201).json(newDocente);
            }
            break;
        case 'PUT':
            const updatedDocente = req.body as Docente;
            const index = db.docentes.findIndex((d) => d.id === updatedDocente.id);
            if (index !== -1) {
                db.docentes[index] = updatedDocente;
                res.status(200).json(updatedDocente);
            } else {
                res.status(404).json({ message: 'Docente not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.docentes = db.docentes.filter((d) => d.id !== id);
                res.status(200).json({ message: 'Docente deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
