import { Graduate, Docente, Projeto, Turma, AlunoRegular, AlunoEspecial, Periodico, Conferencia } from '../types';

const API_BASE_URL = '/api';

async function request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const headers = { 'Content-Type': 'application/json' };
    const config: RequestInit = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
}

export const api = {
    graduates: {
        list: () => request<Graduate[]>('/graduates'),
        create: (data: Graduate) => request<Graduate>('/graduates', 'POST', data),
        createMany: (data: Graduate[]) => request<Graduate[]>('/graduates', 'POST', data),
        update: (data: Graduate) => request<Graduate>('/graduates', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/graduates?id=${id}`, 'DELETE'),
    },
    docentes: {
        list: () => request<Docente[]>('/docentes'),
        create: (data: Docente) => request<Docente>('/docentes', 'POST', data),
        createMany: (data: Docente[]) => request<Docente[]>('/docentes', 'POST', data),
        update: (data: Docente) => request<Docente>('/docentes', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/docentes?id=${id}`, 'DELETE'),
    },
    projetos: {
        list: () => request<Projeto[]>('/projetos'),
        create: (data: Projeto) => request<Projeto>('/projetos', 'POST', data),
        createMany: (data: Projeto[]) => request<Projeto[]>('/projetos', 'POST', data),
        update: (data: Projeto) => request<Projeto>('/projetos', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/projetos?id=${id}`, 'DELETE'),
    },
    turmas: {
        list: () => request<Turma[]>('/turmas'),
        create: (data: Turma) => request<Turma>('/turmas', 'POST', data),
        createMany: (data: Turma[]) => request<Turma[]>('/turmas', 'POST', data),
        update: (data: Turma) => request<Turma>('/turmas', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/turmas?id=${id}`, 'DELETE'),
    },
    alunosRegulares: {
        list: () => request<AlunoRegular[]>('/alunos-regulares'),
        create: (data: AlunoRegular) => request<AlunoRegular>('/alunos-regulares', 'POST', data),
        createMany: (data: AlunoRegular[]) => request<AlunoRegular[]>('/alunos-regulares', 'POST', data),
        update: (data: AlunoRegular) => request<AlunoRegular>('/alunos-regulares', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/alunos-regulares?id=${id}`, 'DELETE'),
    },
    alunosEspeciais: {
        list: () => request<AlunoEspecial[]>('/alunos-especiais'),
        create: (data: AlunoEspecial) => request<AlunoEspecial>('/alunos-especiais', 'POST', data),
        createMany: (data: AlunoEspecial[]) => request<AlunoEspecial[]>('/alunos-especiais', 'POST', data),
        update: (data: AlunoEspecial) => request<AlunoEspecial>('/alunos-especiais', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/alunos-especiais?id=${id}`, 'DELETE'),
    },
    periodicos: {
        list: () => request<Periodico[]>('/periodicos'),
        create: (data: Periodico) => request<Periodico>('/periodicos', 'POST', data),
        createMany: (data: Periodico[]) => request<Periodico[]>('/periodicos', 'POST', data),
        update: (data: Periodico) => request<Periodico>('/periodicos', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/periodicos?id=${id}`, 'DELETE'),
    },
    conferencias: {
        list: () => request<Conferencia[]>('/conferencias'),
        create: (data: Conferencia) => request<Conferencia>('/conferencias', 'POST', data),
        createMany: (data: Conferencia[]) => request<Conferencia[]>('/conferencias', 'POST', data),
        update: (data: Conferencia) => request<Conferencia>('/conferencias', 'PUT', data),
        delete: (id: string) => request<{ message: string }>(`/conferencias?id=${id}`, 'DELETE'),
    },
};
