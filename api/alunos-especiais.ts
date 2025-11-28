import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../lib/db';
import { AlunoEspecial } from '../types';

export default function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            res.status(200).json(db.alunosEspeciais);
            break;
        case 'POST':
            const body = req.body;
            if (Array.isArray(body)) {
                const newAlunos = body as AlunoEspecial[];
                db.alunosEspeciais.push(...newAlunos);
                res.status(201).json(newAlunos);
            } else {
                const newAluno = body as AlunoEspecial;
                db.alunosEspeciais.push(newAluno);
                res.status(201).json(newAluno);
            }
            break;
        case 'PUT':
            const updatedAluno = req.body as AlunoEspecial;
            const index = db.alunosEspeciais.findIndex((a) => a.id === updatedAluno.id);
            if (index !== -1) {
                db.alunosEspeciais[index] = updatedAluno;
                res.status(200).json(updatedAluno);
            } else {
                res.status(404).json({ message: 'Aluno Especial not found' });
            }
            break;
        case 'DELETE':
            const { id } = req.query;
            if (typeof id === 'string') {
                db.alunosEspeciais = db.alunosEspeciais.filter((a) => a.id !== id);
                res.status(200).json({ message: 'Aluno Especial deleted' });
            } else {
                res.status(400).json({ message: 'Invalid ID' });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
