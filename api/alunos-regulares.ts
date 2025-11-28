import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../lib/db.js';
import { AlunoRegular } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.alunosRegulares);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newAlunos = body as AlunoRegular[];
                db.alunosRegulares.push(...newAlunos);
                res.status(201).json(newAlunos);
            } else {
                const newAluno = body as AlunoRegular;
                db.alunosRegulares.push(newAluno);
                res.status(201).json(newAluno);
            }
            break;
        case 'PUT':
            const updatedAluno = req.body as AlunoRegular;
            const index = db.alunosRegulares.findIndex((a) => a.id === updatedAluno.id);
            if (index !== -1) {
                db.alunosRegulares[index] = updatedAluno;
                res.status(200).json(updatedAluno);
            } else {
                res.status(404).json({ message: 'Aluno Regular not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.alunosRegulares = db.alunosRegulares.filter((a) => a.id !== id);
                res.status(200).json({ message: 'Aluno Regular deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
