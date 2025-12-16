import { collection, deleteDoc, doc, getDocs, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Graduate, Docente, Projeto, Turma, AlunoRegular, AlunoEspecial, Periodico, Conferencia } from '../types';

type WithId = { id: string };

const COLLECTIONS = {
    graduates: 'graduates',
    docentes: 'docentes',
    projetos: 'projetos',
    turmas: 'turmas',
    alunosRegulares: 'alunosRegulares',
    alunosEspeciais: 'alunosEspeciais',
    periodicos: 'periodicos',
    conferencias: 'conferencias',
} as const;

const BATCH_LIMIT = 500;

const listCollection = async <T extends WithId>(collectionName: string): Promise<T[]> => {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as T;
        return { ...data, id: data.id ?? docSnap.id };
    });
};

const createItem = async <T extends WithId>(collectionName: string, data: T): Promise<T> => {
    await setDoc(doc(db, collectionName, data.id), data);
    return data;
};

const createManyItems = async <T extends WithId>(collectionName: string, data: T[]): Promise<T[]> => {
    if (!data.length) return [];

    for (let i = 0; i < data.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        data.slice(i, i + BATCH_LIMIT).forEach((item) => {
            batch.set(doc(db, collectionName, item.id), item);
        });
        await batch.commit();
    }

    return data;
};

const updateItem = async <T extends WithId>(collectionName: string, data: T): Promise<T> => {
    await setDoc(doc(db, collectionName, data.id), data, { merge: true });
    return data;
};

const deleteItem = async (collectionName: string, id: string) => {
    await deleteDoc(doc(db, collectionName, id));
    return { message: `${collectionName} item deleted` };
};

const clearCollection = async (collectionName: string) => {
    const snapshot = await getDocs(collection(db, collectionName));
    if (snapshot.empty) return;

    const docs = snapshot.docs;
    for (let i = 0; i < docs.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        docs.slice(i, i + BATCH_LIMIT).forEach((docSnap) => batch.delete(docSnap.ref));
        await batch.commit();
    }
};

export const api = {
    graduates: {
        list: () => listCollection<Graduate>(COLLECTIONS.graduates),
        create: (data: Graduate) => createItem<Graduate>(COLLECTIONS.graduates, data),
        createMany: (data: Graduate[]) => createManyItems<Graduate>(COLLECTIONS.graduates, data),
        update: (data: Graduate) => updateItem<Graduate>(COLLECTIONS.graduates, data),
        delete: (id: string) => deleteItem(COLLECTIONS.graduates, id),
        clear: () => clearCollection(COLLECTIONS.graduates),
    },
    docentes: {
        list: () => listCollection<Docente>(COLLECTIONS.docentes),
        create: (data: Docente) => createItem<Docente>(COLLECTIONS.docentes, data),
        createMany: (data: Docente[]) => createManyItems<Docente>(COLLECTIONS.docentes, data),
        update: (data: Docente) => updateItem<Docente>(COLLECTIONS.docentes, data),
        delete: (id: string) => deleteItem(COLLECTIONS.docentes, id),
        clear: () => clearCollection(COLLECTIONS.docentes),
    },
    projetos: {
        list: () => listCollection<Projeto>(COLLECTIONS.projetos),
        create: (data: Projeto) => createItem<Projeto>(COLLECTIONS.projetos, data),
        createMany: (data: Projeto[]) => createManyItems<Projeto>(COLLECTIONS.projetos, data),
        update: (data: Projeto) => updateItem<Projeto>(COLLECTIONS.projetos, data),
        delete: (id: string) => deleteItem(COLLECTIONS.projetos, id),
        clear: () => clearCollection(COLLECTIONS.projetos),
    },
    turmas: {
        list: () => listCollection<Turma>(COLLECTIONS.turmas),
        create: (data: Turma) => createItem<Turma>(COLLECTIONS.turmas, data),
        createMany: (data: Turma[]) => createManyItems<Turma>(COLLECTIONS.turmas, data),
        update: (data: Turma) => updateItem<Turma>(COLLECTIONS.turmas, data),
        delete: (id: string) => deleteItem(COLLECTIONS.turmas, id),
        clear: () => clearCollection(COLLECTIONS.turmas),
    },
    alunosRegulares: {
        list: () => listCollection<AlunoRegular>(COLLECTIONS.alunosRegulares),
        create: (data: AlunoRegular) => createItem<AlunoRegular>(COLLECTIONS.alunosRegulares, data),
        createMany: (data: AlunoRegular[]) => createManyItems<AlunoRegular>(COLLECTIONS.alunosRegulares, data),
        update: (data: AlunoRegular) => updateItem<AlunoRegular>(COLLECTIONS.alunosRegulares, data),
        delete: (id: string) => deleteItem(COLLECTIONS.alunosRegulares, id),
        clear: () => clearCollection(COLLECTIONS.alunosRegulares),
    },
    alunosEspeciais: {
        list: () => listCollection<AlunoEspecial>(COLLECTIONS.alunosEspeciais),
        create: (data: AlunoEspecial) => createItem<AlunoEspecial>(COLLECTIONS.alunosEspeciais, data),
        createMany: (data: AlunoEspecial[]) => createManyItems<AlunoEspecial>(COLLECTIONS.alunosEspeciais, data),
        update: (data: AlunoEspecial) => updateItem<AlunoEspecial>(COLLECTIONS.alunosEspeciais, data),
        delete: (id: string) => deleteItem(COLLECTIONS.alunosEspeciais, id),
        clear: () => clearCollection(COLLECTIONS.alunosEspeciais),
    },
    periodicos: {
        list: () => listCollection<Periodico>(COLLECTIONS.periodicos),
        create: (data: Periodico) => createItem<Periodico>(COLLECTIONS.periodicos, data),
        createMany: (data: Periodico[]) => createManyItems<Periodico>(COLLECTIONS.periodicos, data),
        update: (data: Periodico) => updateItem<Periodico>(COLLECTIONS.periodicos, data),
        delete: (id: string) => deleteItem(COLLECTIONS.periodicos, id),
        clear: () => clearCollection(COLLECTIONS.periodicos),
    },
    conferencias: {
        list: () => listCollection<Conferencia>(COLLECTIONS.conferencias),
        create: (data: Conferencia) => createItem<Conferencia>(COLLECTIONS.conferencias, data),
        createMany: (data: Conferencia[]) => createManyItems<Conferencia>(COLLECTIONS.conferencias, data),
        update: (data: Conferencia) => updateItem<Conferencia>(COLLECTIONS.conferencias, data),
        delete: (id: string) => deleteItem(COLLECTIONS.conferencias, id),
        clear: () => clearCollection(COLLECTIONS.conferencias),
    },
};
