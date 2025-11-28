import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../lib/db';
import { Turma } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.turmas);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newTurmas = body as Turma[];
                db.turmas.push(...newTurmas);
                res.status(201).json(newTurmas);
            } else {
                const newTurma = body as Turma;
                db.turmas.push(newTurma);
                res.status(201).json(newTurma);
            }
            break;
        case 'PUT':
            const updatedTurma = req.body as Turma;
            const index = db.turmas.findIndex((t) => t.id === updatedTurma.id);
            if (index !== -1) {
                db.turmas[index] = updatedTurma;
                res.status(200).json(updatedTurma);
            } else {
                res.status(404).json({ message: 'Turma not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.turmas = db.turmas.filter((t) => t.id !== id);
                res.status(200).json({ message: 'Turma deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
