import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataManagement from './components/DataManagement';
import AdminPanel from './components/AdminPanel';
import { Graduate, Docente, Projeto, Turma, AlunoRegular, Periodico, Conferencia, AlunoEspecial, User } from './types';
import TurmasDashboard from './components/TurmasDashboard';
import AlunoRegularDashboard from './components/AlunoRegularDashboard';
import PublicacoesDashboard from './components/PublicacoesDashboard';
import DocentesDashboard from './components/DocentesDashboard';
import AlunoEspecialDashboard from './components/AlunoEspecialDashboard';
import { MOCK_GRADUATES, MOCK_USERS } from './lib/constants';
import { api } from './services/api';
import LoginModal from './components/LoginModal';

type View = 'dashboard' | 'turmas' | 'alunoRegular' | 'alunoEspecial' | 'docentes' | 'publicacoes' | 'dataManagement' | 'admin';

const viewTitles: Record<View, string> = {
  dashboard: 'Painel PPGEE - Elétrica e Computação',
  turmas: 'Visualização de Dados de Turmas',
  alunoRegular: 'Visualização de Alunos Regulares',
  alunoEspecial: 'Visualização de Alunos Especiais',
  docentes: 'Visualização de Dados de Docentes',
  publicacoes: 'Visualização de Dados de Publicações',
  dataManagement: 'Gerenciamento de Dados',
  admin: 'Painel Administrativo'
};

const App: React.FC = () => {
  // Default to Visualizador (index 1 in MOCK_USERS based on previous context, or find by role)
  const defaultUser = MOCK_USERS.find(u => u.role === 'Visualizador') || MOCK_USERS[1];
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);
  const userRole = currentUser.role;

  const [activeView, setActiveView] = useState<View>('dashboard');
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunosRegulares, setAlunosRegulares] = useState<AlunoRegular[]>([]);
  const [alunosEspeciais, setAlunosEspeciais] = useState<AlunoEspecial[]>([]);
  const [periodicos, setPeriodicos] = useState<Periodico[]>([]);
  const [conferencias, setConferencias] = useState<Conferencia[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    // Redirect Viewer away from restricted pages
    if (userRole === 'Visualizador') {
      if (['docentes', 'dataManagement', 'admin'].includes(activeView)) {
        setActiveView('dashboard');
      }
    }
  }, [userRole, activeView]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          graduatesData,
          docentesData,
          projetosData,
          turmasData,
          alunosRegularesData,
          alunosEspeciaisData,
          periodicosData,
          conferenciasData
        ] = await Promise.all([
          api.graduates.list(),
          api.docentes.list(),
          api.projetos.list(),
          api.turmas.list(),
          api.alunosRegulares.list(),
          api.alunosEspeciais.list(),
          api.periodicos.list(),
          api.conferencias.list()
        ]);

        setGraduates(graduatesData);
        setDocentes(docentesData);
        setProjetos(projetosData);
        setTurmas(turmasData);
        setAlunosRegulares(alunosRegularesData);
        setAlunosEspeciais(alunosEspeciaisData);
        setPeriodicos(periodicosData);
        setConferencias(conferenciasData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddGraduate = useCallback(async (graduate: Graduate) => {
    try {
      const newGraduate = await api.graduates.create(graduate);
      setGraduates(prev => [...prev, newGraduate]);
    } catch (error) {
      console.error("Failed to add graduate:", error);
    }
  }, []);

  const handleUpdateGraduate = useCallback(async (updatedGraduate: Graduate) => {
    try {
      const result = await api.graduates.update(updatedGraduate);
      setGraduates(prev => prev.map(g => g.id === result.id ? result : g));
    } catch (error) {
      console.error("Failed to update graduate:", error);
    }
  }, []);

  const handleDeleteGraduate = useCallback(async (id: string) => {
    try {
      await api.graduates.delete(id);
      setGraduates(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error("Failed to delete graduate:", error);
    }
  }, []);

  const handleImportGraduates = useCallback(async (newGraduates: Graduate[]) => {
    try {
      const sanitizedGraduates = newGraduates.map(g => ({
        ...g,
        trabalhando: g.trabalhando ?? "",
        anoDefesa: g.anoDefesa ?? "",
      }));
      const cleanGraduates = JSON.parse(JSON.stringify(sanitizedGraduates));
      const createdGraduates = await api.graduates.createMany(cleanGraduates);
      setGraduates(prev => [...prev, ...createdGraduates]);
      setActiveView('dashboard');
    } catch (error) {
      console.error("Failed to import graduates:", error);
      alert("Erro ao importar alguns egressos. Verifique o console.");
    }
  }, []);

  const handleAddDocente = useCallback(async (docente: Docente) => {
    try {
      const newDocente = await api.docentes.create(docente);
      setDocentes(prev => [...prev, newDocente]);
    } catch (error) {
      console.error("Failed to add docente:", error);
    }
  }, []);

  const handleUpdateDocente = useCallback(async (updatedDocente: Docente) => {
    try {
      const result = await api.docentes.update(updatedDocente);
      setDocentes(prev => prev.map(d => d.id === result.id ? result : d));
    } catch (error) {
      console.error("Failed to update docente:", error);
    }
  }, []);

  const handleDeleteDocente = useCallback(async (id: string) => {
    try {
      await api.docentes.delete(id);
      setDocentes(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete docente:", error);
    }
  }, []);

  const handleImportDocentes = useCallback(async (newDocentes: Docente[]) => {
    try {
      const sanitizedDocentes = newDocentes.map(d => ({
        ...d,
        email: d.email ?? "",
        fone: d.fone ?? "",
      }));
      const cleanDocentes = JSON.parse(JSON.stringify(sanitizedDocentes));
      const createdDocentes = await api.docentes.createMany(cleanDocentes);
      setDocentes(prev => [...prev, ...createdDocentes]);
    } catch (error) {
      console.error("Failed to import docentes:", error);
      alert("Erro ao importar alguns docentes.");
    }
  }, []);

  const handleAddProjeto = useCallback(async (projeto: Projeto) => {
    try {
      const newProjeto = await api.projetos.create(projeto);
      setProjetos(prev => [...prev, newProjeto]);
    } catch (error) {
      console.error("Failed to add projeto:", error);
    }
  }, []);

  const handleUpdateProjeto = useCallback(async (updatedProjeto: Projeto) => {
    try {
      const result = await api.projetos.update(updatedProjeto);
      setProjetos(prev => prev.map(p => p.id === result.id ? result : p));
    } catch (error) {
      console.error("Failed to update projeto:", error);
    }
  }, []);

  const handleDeleteProjeto = useCallback(async (id: string) => {
    try {
      await api.projetos.delete(id);
      setProjetos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete projeto:", error);
    }
  }, []);

  const handleImportProjetos = useCallback(async (newProjetos: Projeto[]) => {
    try {
      const cleanProjetos = JSON.parse(JSON.stringify(newProjetos));
      const createdProjetos = await api.projetos.createMany(cleanProjetos);
      setProjetos(prev => [...prev, ...createdProjetos]);
    } catch (error) {
      console.error("Failed to import projetos:", error);
      alert("Erro ao importar alguns projetos.");
    }
  }, []);

  const handleAddTurma = useCallback(async (turma: Turma) => {
    try {
      const newTurma = await api.turmas.create(turma);
      setTurmas(prev => [...prev, newTurma]);
    } catch (error) {
      console.error("Failed to add turma:", error);
    }
  }, []);

  const handleUpdateTurma = useCallback(async (updatedTurma: Turma) => {
    try {
      const result = await api.turmas.update(updatedTurma);
      setTurmas(prev => prev.map(t => t.id === result.id ? result : t));
    } catch (error) {
      console.error("Failed to update turma:", error);
    }
  }, []);

  const handleDeleteTurma = useCallback(async (id: string) => {
    try {
      await api.turmas.delete(id);
      setTurmas(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Failed to delete turma:", error);
    }
  }, []);

  const handleImportTurmas = useCallback(async (newTurmas: Turma[]) => {
    try {
      const cleanTurmas = JSON.parse(JSON.stringify(newTurmas));
      const createdTurmas = await api.turmas.createMany(cleanTurmas);
      setTurmas(prev => [...prev, ...createdTurmas]);
    } catch (error) {
      console.error("Failed to import turmas:", error);
      alert("Erro ao importar algumas turmas.");
    }
  }, []);

  const handleAddAlunoRegular = useCallback(async (aluno: AlunoRegular) => {
    try {
      const newAluno = await api.alunosRegulares.create(aluno);
      setAlunosRegulares(prev => [...prev, newAluno]);
    } catch (error) {
      console.error("Failed to add aluno regular:", error);
    }
  }, []);

  const handleUpdateAlunoRegular = useCallback(async (updatedAluno: AlunoRegular) => {
    try {
      const result = await api.alunosRegulares.update(updatedAluno);
      setAlunosRegulares(prev => prev.map(a => a.id === result.id ? result : a));
    } catch (error) {
      console.error("Failed to update aluno regular:", error);
    }
  }, []);

  const handleDeleteAlunoRegular = useCallback(async (id: string) => {
    try {
      await api.alunosRegulares.delete(id);
      setAlunosRegulares(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to delete aluno regular:", error);
    }
  }, []);

  const handleImportAlunosRegulares = useCallback(async (newAlunos: AlunoRegular[]) => {
    try {
      const sanitizedAlunos = newAlunos.map(a => ({
        ...a,
        coOrientador: a.coOrientador ?? "",
        qualificacao: a.qualificacao ?? "",
        defesa: a.defesa ?? "",
        bolsista: a.bolsista ?? "",
        email: a.email ?? "",
        fone: a.fone ?? "",
        informacoesExtras: a.informacoesExtras ?? "",
      }));
      const cleanAlunos = JSON.parse(JSON.stringify(sanitizedAlunos));
      const createdAlunos = await api.alunosRegulares.createMany(cleanAlunos);
      setAlunosRegulares(prev => [...prev, ...createdAlunos]);
    } catch (error) {
      console.error("Failed to import alunos regulares:", error);
      alert("Erro ao importar alguns alunos regulares.");
    }
  }, []);

  const handleAddAlunoEspecial = useCallback(async (aluno: AlunoEspecial) => {
    try {
      const newAluno = await api.alunosEspeciais.create(aluno);
      setAlunosEspeciais(prev => [...prev, newAluno]);
    } catch (error) {
      console.error("Failed to add aluno especial:", error);
    }
  }, []);

  const handleUpdateAlunoEspecial = useCallback(async (updatedAluno: AlunoEspecial) => {
    try {
      const result = await api.alunosEspeciais.update(updatedAluno);
      setAlunosEspeciais(prev => prev.map(a => a.id === result.id ? result : a));
    } catch (error) {
      console.error("Failed to update aluno especial:", error);
    }
  }, []);

  const handleDeleteAlunoEspecial = useCallback(async (id: string) => {
    try {
      await api.alunosEspeciais.delete(id);
      setAlunosEspeciais(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Failed to delete aluno especial:", error);
    }
  }, []);

  const handleImportAlunosEspeciais = useCallback(async (newAlunos: AlunoEspecial[]) => {
    try {
      const sanitizedAlunos = newAlunos.map(a => ({
        ...a,
        email: a.email ?? "",
        fone: a.fone ?? "",
      }));
      const cleanAlunos = JSON.parse(JSON.stringify(sanitizedAlunos));
      const createdAlunos = await api.alunosEspeciais.createMany(cleanAlunos);
      setAlunosEspeciais(prev => [...prev, ...createdAlunos]);
    } catch (error) {
      console.error("Failed to import alunos especiais:", error);
      alert("Erro ao importar alguns alunos especiais.");
    }
  }, []);

  const handleAddPeriodico = useCallback(async (periodico: Periodico) => {
    try {
      const newPeriodico = await api.periodicos.create(periodico);
      setPeriodicos(prev => [...prev, newPeriodico]);
    } catch (error) {
      console.error("Failed to add periodico:", error);
    }
  }, []);
  const handleUpdatePeriodico = useCallback(async (updatedPeriodico: Periodico) => {
    try {
      const result = await api.periodicos.update(updatedPeriodico);
      setPeriodicos(prev => prev.map(p => p.id === result.id ? result : p));
    } catch (error) {
      console.error("Failed to update periodico:", error);
    }
  }, []);
  const handleDeletePeriodico = useCallback(async (id: string) => {
    try {
      await api.periodicos.delete(id);
      setPeriodicos(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete periodico:", error);
    }
  }, []);
  const handleImportPeriodicos = useCallback(async (newPeriodicos: Periodico[]) => {
    try {
      // Periodico interface has explicit types, but categoria comes from Excel row which might be undefined.
      // And explicit booleans are safe.
      const sanitizedPeriodicos = newPeriodicos.map(p => ({
        ...p,
        categoria: p.categoria ?? "",
      }));
      const cleanPeriodicos = JSON.parse(JSON.stringify(sanitizedPeriodicos));
      const createdPeriodicos = await api.periodicos.createMany(cleanPeriodicos);
      setPeriodicos(prev => [...prev, ...createdPeriodicos]);
    } catch (error) {
      console.error("Failed to import periodicos:", error);
      alert("Erro ao importar alguns periódicos.");
    }
  }, []);

  const handleAddConferencia = useCallback(async (conferencia: Conferencia) => {
    try {
      const newConferencia = await api.conferencias.create(conferencia);
      setConferencias(prev => [...prev, newConferencia]);
    } catch (error) {
      console.error("Failed to add conferencia:", error);
    }
  }, []);
  const handleUpdateConferencia = useCallback(async (updatedConferencia: Conferencia) => {
    try {
      const result = await api.conferencias.update(updatedConferencia);
      setConferencias(prev => prev.map(c => c.id === result.id ? result : c));
    } catch (error) {
      console.error("Failed to update conferencia:", error);
    }
  }, []);
  const handleDeleteConferencia = useCallback(async (id: string) => {
    try {
      await api.conferencias.delete(id);
      setConferencias(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error("Failed to delete conferencia:", error);
    }
  }, []);
  const handleImportConferencias = useCallback(async (newConferencias: Conferencia[]) => {
    try {
      const sanitizedConferencias = newConferencias.map(c => ({
        ...c,
        categoria: c.categoria ?? "",
      }));
      const cleanConferencias = JSON.parse(JSON.stringify(sanitizedConferencias));
      const createdConferencias = await api.conferencias.createMany(cleanConferencias);
      setConferencias(prev => [...prev, ...createdConferencias]);
    } catch (error) {
      console.error("Failed to import conferencias:", error);
      alert("Erro ao importar algumas conferências.");
    }
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  const handleRestoreBackup = useCallback(async (data: any) => {
    try {
      if (!data || typeof data !== 'object') {
        throw new Error("Backup data is not a valid object.");
      }

      // Append backup data into Firebase. To replace existing data, use the "Limpar dados" option before restaurar.
      if (Array.isArray(data.graduates)) await api.graduates.createMany(data.graduates);
      if (Array.isArray(data.docentes)) await api.docentes.createMany(data.docentes);
      if (Array.isArray(data.projetos)) await api.projetos.createMany(data.projetos);
      if (Array.isArray(data.turmas)) await api.turmas.createMany(data.turmas);
      if (Array.isArray(data.alunosRegulares)) await api.alunosRegulares.createMany(data.alunosRegulares);
      if (Array.isArray(data.alunosEspeciais)) await api.alunosEspeciais.createMany(data.alunosEspeciais);
      if (Array.isArray(data.periodicos)) await api.periodicos.createMany(data.periodicos);
      if (Array.isArray(data.conferencias)) await api.conferencias.createMany(data.conferencias);

      // Refresh data
      const [
        graduatesData,
        docentesData,
        projetosData,
        turmasData,
        alunosRegularesData,
        alunosEspeciaisData,
        periodicosData,
        conferenciasData
      ] = await Promise.all([
        api.graduates.list(),
        api.docentes.list(),
        api.projetos.list(),
        api.turmas.list(),
        api.alunosRegulares.list(),
        api.alunosEspeciais.list(),
        api.periodicos.list(),
        api.conferencias.list()
      ]);

      setGraduates(graduatesData);
      setDocentes(docentesData);
      setProjetos(projetosData);
      setTurmas(turmasData);
      setAlunosRegulares(alunosRegularesData);
      setAlunosEspeciais(alunosEspeciaisData);
      setPeriodicos(periodicosData);
      setConferencias(conferenciasData);

      alert('Backup restaurado com sucesso (dados adicionados).');
    } catch (error) {
      console.error("Falha ao restaurar dados:", error);
      alert(`Ocorreu um erro ao restaurar os dados do backup: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, []);

  const handleClearAllData = useCallback(async () => {
    try {
      await Promise.all([
        api.graduates.clear(),
        api.docentes.clear(),
        api.projetos.clear(),
        api.turmas.clear(),
        api.alunosRegulares.clear(),
        api.alunosEspeciais.clear(),
        api.periodicos.clear(),
        api.conferencias.clear()
      ]);

      setGraduates([]);
      setDocentes([]);
      setProjetos([]);
      setTurmas([]);
      setAlunosRegulares([]);
      setAlunosEspeciais([]);
      setPeriodicos([]);
      setConferencias([]);

      alert('Todos os dados foram removidos do Firebase.');
    } catch (error) {
      console.error("Falha ao limpar dados:", error);
      alert('Erro ao limpar dados. Verifique o console.');
    }
  }, []);

  const handleLoginSuccess = useCallback(() => {
    const adminUser = MOCK_USERS.find(u => u.role === 'Administrador');
    if (adminUser) {
      setCurrentUser(adminUser);
    }
  }, []);

  const handleLogout = useCallback(() => {
    const viewerUser = MOCK_USERS.find(u => u.role === 'Visualizador');
    if (viewerUser) {
      setCurrentUser(viewerUser);
      setActiveView('dashboard');
    }
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard
          graduates={graduates}
          docentes={docentes}
          turmas={turmas}
          onUpdate={handleUpdateGraduate}
          onDelete={handleDeleteGraduate}
          projetos={projetos}
          onUpdateProjeto={handleUpdateProjeto}
          onDeleteProjeto={handleDeleteProjeto}
          userRole={userRole}
        />;
      case 'turmas':
        return <TurmasDashboard
          turmas={turmas}
          onUpdate={handleUpdateTurma}
          onDelete={handleDeleteTurma}
          userRole={userRole}
        />;
      case 'alunoRegular':
        return <AlunoRegularDashboard
          alunos={alunosRegulares}
          onUpdate={handleUpdateAlunoRegular}
          onDelete={handleDeleteAlunoRegular}
          userRole={userRole}
        />;
      case 'alunoEspecial':
        return <AlunoEspecialDashboard />;
      case 'docentes':
        // Protected view, sidebar should prevent access but double check here
        if (userRole === 'Visualizador') return null;
        return <DocentesDashboard
          docentes={docentes}
          onUpdate={handleUpdateDocente}
          onDelete={handleDeleteDocente}
          userRole={userRole}
        />;
      case 'publicacoes':
        return <PublicacoesDashboard
          periodicos={periodicos}
          conferencias={conferencias}
          onUpdatePeriodico={handleUpdatePeriodico}
          onDeletePeriodico={handleDeletePeriodico}
          onUpdateConferencia={handleUpdateConferencia}
          onDeleteConferencia={handleDeleteConferencia}
          userRole={userRole}
        />;
      case 'dataManagement':
        // Protected view
        if (userRole === 'Visualizador') return null;
        return <DataManagement
          onAddGraduate={handleAddGraduate}
          onImportGraduates={handleImportGraduates}
          onAddDocente={handleAddDocente}
          onImportDocentes={handleImportDocentes}
          onAddProjeto={handleAddProjeto}
          onImportProjetos={handleImportProjetos}
          onAddTurma={handleAddTurma}
          onImportTurmas={handleImportTurmas}
          onAddAlunoRegular={handleAddAlunoRegular}
          onImportAlunosRegulares={handleImportAlunosRegulares}
          onAddAlunoEspecial={handleAddAlunoEspecial}
          onImportAlunosEspeciais={handleImportAlunosEspeciais}
          onAddPeriodico={handleAddPeriodico}
          onImportPeriodicos={handleImportPeriodicos}
          onAddConferencia={handleAddConferencia}
          onImportConferencias={handleImportConferencias}
          onRestoreBackup={handleRestoreBackup}
          graduates={graduates}
          docentes={docentes}
          projetos={projetos}
          turmas={turmas}
          alunosRegulares={alunosRegulares}
          alunosEspeciais={alunosEspeciais}
          periodicos={periodicos}
          conferencias={conferencias}
          onClearAllData={handleClearAllData}
        />;
      case 'admin':
        // Protected view
        if (userRole === 'Visualizador') return null;
        return <AdminPanel />;
      default:
        return <Dashboard
          graduates={graduates}
          docentes={docentes}
          turmas={turmas}
          onUpdate={handleUpdateGraduate}
          onDelete={handleDeleteGraduate}
          projetos={projetos}
          onUpdateProjeto={handleUpdateProjeto}
          onDeleteProjeto={handleDeleteProjeto}
          userRole={userRole}
        />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isCollapsed={isSidebarCollapsed}
        onToggle={handleToggleSidebar}
        userRole={userRole}
        onUserChange={(userId) => {
          // This prop might be redundant now if we use the login modal, 
          // but keeping it for compatibility with Sidebar's existing logic if needed.
          // Or better, we repurpose it or add a new prop for login request.
          // Let's assume Sidebar calls this when switching users in dev mode, 
          // but we want to intercept for Admin.
        }}
        currentUser={currentUser}
        onLoginRequest={() => setIsLoginModalOpen(true)}
        onLogoutRequest={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[activeView]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderView()}
        </main>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
