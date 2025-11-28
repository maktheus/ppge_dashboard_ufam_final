import { Graduate, Docente, Projeto, Turma, AlunoRegular, AlunoEspecial, Periodico, Conferencia } from '../types.js';

// In-memory storage
// Note: This data will be reset when the serverless function container is recycled.
// This is expected behavior as per user request.

interface Database {
    graduates: Graduate[];
    docentes: Docente[];
    projetos: Projeto[];
    turmas: Turma[];
    alunosRegulares: AlunoRegular[];
    alunosEspeciais: AlunoEspecial[];
    periodicos: Periodico[];
    conferencias: Conferencia[];
}

// Initial empty state
const db: Database = {
    graduates: [],
    docentes: [],
    projetos: [],
    turmas: [],
    alunosRegulares: [],
    alunosEspeciais: [],
    periodicos: [],
    conferencias: [],
};

export default db;
