import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../lib/db';
import { Conferencia } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.conferencias);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newConferencias = body as Conferencia[];
                db.conferencias.push(...newConferencias);
                res.status(201).json(newConferencias);
            } else {
                const newConferencia = body as Conferencia;
                db.conferencias.push(newConferencia);
                res.status(201).json(newConferencia);
            }
            break;
        case 'PUT':
            const updatedConferencia = req.body as Conferencia;
            const index = db.conferencias.findIndex((c) => c.id === updatedConferencia.id);
            if (index !== -1) {
                db.conferencias[index] = updatedConferencia;
                res.status(200).json(updatedConferencia);
            } else {
                res.status(404).json({ message: 'Conferencia not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.conferencias = db.conferencias.filter((c) => c.id !== id);
                res.status(200).json({ message: 'Conferencia deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
