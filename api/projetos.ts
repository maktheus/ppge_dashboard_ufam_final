import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from './_db';
import { Projeto } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.projetos);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newProjetos = body as Projeto[];
                db.projetos.push(...newProjetos);
                res.status(201).json(newProjetos);
            } else {
                const newProjeto = body as Projeto;
                db.projetos.push(newProjeto);
                res.status(201).json(newProjeto);
            }
            break;
        case 'PUT':
            const updatedProjeto = req.body as Projeto;
            const index = db.projetos.findIndex((p) => p.id === updatedProjeto.id);
            if (index !== -1) {
                db.projetos[index] = updatedProjeto;
                res.status(200).json(updatedProjeto);
            } else {
                res.status(404).json({ message: 'Projeto not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.projetos = db.projetos.filter((p) => p.id !== id);
                res.status(200).json({ message: 'Projeto deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
