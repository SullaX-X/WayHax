import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Trophy, 
  Calendar, 
  Users, 
  FileText, 
  Plus, 
  Search, 
  CheckCircle, 
  X, 
  Download, 
  User, 
  Briefcase,
  ChevronLeft,
  Award,
  Filter,
  Send,
  Settings,
  Trash2,
  BarChart3,
  Edit,
  Shield,
  Clock,
  MoreHorizontal,
  Eye,
  LogOut,
  LogIn
} from 'lucide-react';

// --- Типы данных и Интерфейсы ---

type UserRole = 'participant' | 'organizer' | 'admin';

type ContestType = 'olympiad' | 'creative' | 'sport' | 'hackathon';
type ContestStatus = 'open' | 'closed' | 'judging' | 'completed';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  group?: string; // Класс/Группа/Организация
  avatar?: string;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: ContestType;
  startDate: string;
  endDate: string;
  organizerId: string; // ID организатора
  organizerName: string;
  image: string;
  status: ContestStatus;
  participantLimit?: number;
  files?: Array<{ name: string; size: string }>;
  resultsPublished: boolean; // Флаг публикации результатов
}

interface Application {
  id: string;
  contestId: string;
  userId: string;
  applicantName: string;
  group: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'winner' | 'participant';
  submissionDate: string;
  score?: number; // Баллы (0-100)
}

// --- Тестовые данные (Mock Data) ---

const INITIAL_USERS: UserData[] = [
  { id: 'u1', name: 'Алексей Смирнов', email: 'alex@school.ru', role: 'participant', group: '9Б', avatar: 'A' },
  { id: 'u2', name: 'Ольга Николаевна', email: 'olga@lyceum.ru', role: 'organizer', group: 'Лицей №5', avatar: 'O' },
  { id: 'u3', name: 'Администратор', email: 'admin@edu.gov', role: 'admin', avatar: 'S' },
  { id: 'u4', name: 'Мария Иванова', email: 'maria@art.ru', role: 'participant', group: '11А', avatar: 'M' },
  { id: 'u5', name: 'Технопарк "Квант"', email: 'org@quant.ru', role: 'organizer', group: 'Технопарк', avatar: 'T' },
];

const CONTEST_IMAGES = [
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800', // Math/Science
  'https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=800', // Tech/Coding
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800', // Art
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800', // University
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', // Classroom
  'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=800', // Books
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800'  // School
];

const INITIAL_CONTESTS: Contest[] = [
  {
    id: 'c1',
    title: 'Математическая Олимпиада "Пифагор"',
    description: 'Ежегодная олимпиада для школьников 5-11 классов. Проверь свои знания!',
    fullDescription: 'Приглашаем всех любителей математики принять участие в нашей ежегодной олимпиаде. Вас ждут нестандартные задачи, логические головоломки и ценные призы. Победители получат льготы при поступлении в профильные вузы.',
    type: 'olympiad',
    startDate: '2023-11-01',
    endDate: '2023-11-20',
    organizerId: 'u2',
    organizerName: 'Лицей №5',
    image: CONTEST_IMAGES[0],
    status: 'completed',
    resultsPublished: true,
    files: [{ name: 'Положение.pdf', size: '1.2 MB' }, { name: 'Примеры_задач.pdf', size: '2.4 MB' }]
  },
  {
    id: 'c2',
    title: 'Хакатон "Code Future 2024"',
    description: 'Командное соревнование по разработке веб-приложений за 48 часов.',
    fullDescription: 'Собери команду и создай прототип будущего! Темы: Образование, Экология, Умный город. Жюри состоит из экспертов ведущих IT-компаний. Главный приз - стажировка.',
    type: 'hackathon',
    startDate: '2023-12-10',
    endDate: '2023-12-12',
    organizerId: 'u5',
    organizerName: 'Технопарк "Квант"',
    image: CONTEST_IMAGES[1],
    status: 'open',
    resultsPublished: false,
    files: [{ name: 'Регламент_хакатона.pdf', size: '3.5 MB' }]
  },
  {
    id: 'c3',
    title: 'Конкурс Рисунков "Зимняя Сказка"',
    description: 'Творческий конкурс для всех возрастов. Тема: зима и новогоднее чудо.',
    fullDescription: 'Принимаются работы в любой технике: акварель, гуашь, масло, цифровая живопись. Лучшие работы будут выставлены в городской галерее.',
    type: 'creative',
    startDate: '2023-12-01',
    endDate: '2023-12-25',
    organizerId: 'u2',
    organizerName: 'Лицей №5',
    image: CONTEST_IMAGES[2],
    status: 'judging',
    resultsPublished: false,
    files: [{ name: 'Требования_к_работам.docx', size: '0.5 MB' }]
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    contestId: 'c1',
    userId: 'u1',
    applicantName: 'Алексей Смирнов',
    group: '9Б',
    email: 'alex@school.ru',
    status: 'winner',
    submissionDate: '2023-11-02',
    score: 98
  },
  {
    id: 'a2',
    contestId: 'c2',
    userId: 'u4',
    applicantName: 'Команда "Ракета"',
    group: '11А',
    email: 'maria@art.ru',
    status: 'pending',
    submissionDate: '2023-12-10'
  },
  {
    id: 'a3',
    contestId: 'c1',
    userId: 'u4',
    applicantName: 'Мария Иванова',
    group: '11А',
    email: 'maria@art.ru',
    status: 'participant',
    submissionDate: '2023-11-05',
    score: 75
  },
  {
    id: 'a4',
    contestId: 'c3',
    userId: 'u1',
    applicantName: 'Алексей Смирнов',
    group: '9Б',
    email: 'alex@school.ru',
    status: 'approved',
    submissionDate: '2023-12-05'
  }
];

// --- Вспомогательные функции ---

const getRandomImage = () => {
  return CONTEST_IMAGES[Math.floor(Math.random() * CONTEST_IMAGES.length)];
};

const getTypeLabel = (type: ContestType) => {
  switch (type) {
    case 'olympiad': return 'Олимпиада';
    case 'hackathon': return 'Хакатон';
    case 'creative': return 'Творчество';
    case 'sport': return 'Спорт';
    default: return 'Другое';
  }
};

const getStatusInfo = (status: Application['status']) => {
  switch(status) {
    case 'winner': return { label: 'Победитель', color: 'text-amber-700 bg-amber-100 border-amber-200', icon: Trophy };
    case 'approved': return { label: 'Одобрена', color: 'text-green-700 bg-green-100 border-green-200', icon: CheckCircle };
    case 'rejected': return { label: 'Отклонена', color: 'text-red-700 bg-red-100 border-red-200', icon: X };
    case 'participant': return { label: 'Участник', color: 'text-blue-700 bg-blue-100 border-blue-200', icon: User };
    case 'pending': return { label: 'На проверке', color: 'text-slate-600 bg-slate-100 border-slate-200', icon: Clock };
    default: return { label: status, color: 'text-slate-600 bg-slate-100', icon: User };
  }
};

const getContestStatusLabel = (status: ContestStatus) => {
  switch(status) {
    case 'open': return { label: 'Идет набор', color: 'bg-green-100 text-green-700' };
    case 'closed': return { label: 'Набор закрыт', color: 'bg-red-100 text-red-700' };
    case 'judging': return { label: 'Идет судейство', color: 'bg-amber-100 text-amber-700' };
    case 'completed': return { label: 'Завершен', color: 'bg-slate-100 text-slate-700' };
  }
};

// --- Основной Компонент App ---

const App = () => {
  // Global State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
  const [contests, setContests] = useState<Contest[]>(INITIAL_CONTESTS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);

  // Navigation State
  const [view, setView] = useState<string>('catalog');
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const [organizerTab, setOrganizerTab] = useState<'info' | 'applications' | 'results'>('info');

  // Filters State
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Forms State
  const [newContest, setNewContest] = useState<Partial<Contest>>({ type: 'olympiad', status: 'open' });
  const [applicationForm, setApplicationForm] = useState({ name: '', group: '', email: '' });

  // --- Actions ---

  const handleLogin = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setView(user.role === 'admin' ? 'admin_dashboard' : 'catalog');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setView('catalog');
  };

  const handleApply = () => {
    if (!applicationForm.name || !selectedContestId || !currentUser) return;
    const newApp: Application = {
      id: Date.now().toString(),
      contestId: selectedContestId,
      userId: currentUser.id,
      applicantName: applicationForm.name,
      group: applicationForm.group,
      email: applicationForm.email,
      status: 'pending',
      submissionDate: new Date().toISOString().split('T')[0]
    };
    setApplications([...applications, newApp]);
    setView('user_applications');
  };

  const handleCreateContest = () => {
    if (!newContest.title || !newContest.description || !currentUser) return;
    const contest: Contest = {
      id: Date.now().toString(),
      title: newContest.title || '',
      description: newContest.description || '',
      fullDescription: newContest.description || '', // Simplified for demo
      type: newContest.type as ContestType || 'olympiad',
      startDate: newContest.startDate || '',
      endDate: newContest.endDate || '',
      organizerId: currentUser.id,
      organizerName: currentUser.group || currentUser.name,
      image: getRandomImage(), // Использование случайной картинки
      status: 'open',
      resultsPublished: false,
      files: [{ name: 'Задание.pdf', size: '1.2 MB' }] // Mock
    };
    setContests([contest, ...contests]);
    setView('organizer_dashboard');
    setNewContest({ type: 'olympiad', status: 'open' });
  };

  const handleDeleteContest = (id: string) => {
    if (confirm('Вы уверены? Все заявки также будут удалены.')) {
      setContests(contests.filter(c => c.id !== id));
      setApplications(applications.filter(a => a.contestId !== id));
    }
  };

  const handlePublishResults = (contestId: string) => {
    setContests(contests.map(c => c.id === contestId ? { ...c, resultsPublished: true, status: 'completed' } : c));
    alert('Результаты успешно опубликованы! Участники получили уведомления.');
  };

  const handleUpdateAppStatus = (appId: string, status: Application['status']) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, status } : a));
  };

  const handleUpdateScore = (appId: string, score: number) => {
    setApplications(applications.map(a => a.id === appId ? { ...a, score } : a));
  };

  // --- Login Screen ---

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-900">
        <div className="bg-white max-w-4xl w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 font-bold text-2xl tracking-tight mb-8">
                <div className="bg-white text-blue-600 p-2 rounded-xl shadow-lg">
                  <Trophy className="w-6 h-6" strokeWidth={3} />
                </div>
                EduContest
              </div>
              <h1 className="text-4xl font-bold mb-4">Единый портал образовательных конкурсов</h1>
              <p className="text-blue-100 text-lg">Управляйте заявками, участвуйте в олимпиадах и публикуйте результаты в одном месте.</p>
            </div>
            <div className="absolute right-0 top-0 h-full w-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          </div>
          <div className="md:w-1/2 p-12 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Выберите роль для входа</h2>
            <div className="space-y-4">
              <button onClick={() => handleLogin('u1')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition group text-left">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Участник</div>
                  <div className="text-sm text-slate-500">Подача заявок, портфолио</div>
                </div>
              </button>

              <button onClick={() => handleLogin('u2')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition group text-left">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Организатор</div>
                  <div className="text-sm text-slate-500">Создание конкурсов, оценка</div>
                </div>
              </button>

              <button onClick={() => handleLogin('u3')} className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition group text-left">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Администратор</div>
                  <div className="text-sm text-slate-500">Управление платформой</div>
                </div>
              </button>
            </div>
            <p className="mt-8 text-center text-sm text-slate-400">Демонстрационная версия MVP</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Views Renders ---

  const renderCatalog = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Единый портал<br/>образовательных конкурсов</h1>
          <p className="text-blue-100 text-lg mb-8">Участвуйте в олимпиадах, хакатонах и творческих проектах. Формируйте портфолио и получайте сертификаты онлайн.</p>
          <button 
             onClick={() => { document.getElementById('catalog-grid')?.scrollIntoView({ behavior: 'smooth' }) }}
             className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition shadow-lg"
          >
            Найти конкурс
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm" id="catalog-grid">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {['all', 'olympiad', 'hackathon', 'creative', 'sport'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === type ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {type === 'all' ? 'Все типы' : getTypeLabel(type as ContestType)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-48"
          >
            <option value="all">Все статусы</option>
            <option value="open">Идет прием заявок</option>
            <option value="judging">Идет судейство</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests
          .filter(c => filterType === 'all' || c.type === filterType)
          .filter(c => filterStatus === 'all' || c.status === filterStatus)
          .map(contest => (
            <div key={contest.id} 
                 onClick={() => { setSelectedContestId(contest.id); setView('contest_details'); }}
                 className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={contest.image} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute top-3 left-3 flex gap-2">
                   <span className="bg-white/90 backdrop-blur text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                      {getTypeLabel(contest.type)}
                   </span>
                </div>
                <div className="absolute bottom-3 right-3">
                   <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getContestStatusLabel(contest.status).color}`}>
                      {getContestStatusLabel(contest.status).label}
                   </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-xs text-slate-400 mb-2 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(contest.endDate).toLocaleDateString('ru-RU')}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{contest.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{contest.description}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                   <div className="flex items-center text-slate-500 text-sm">
                      <Users className="w-4 h-4 mr-1.5" />
                      {applications.filter(a => a.contestId === contest.id).length} заявок
                   </div>
                   <span className="text-blue-600 font-medium text-sm flex items-center">Подробнее <ChevronLeft className="w-4 h-4 rotate-180 ml-1"/></span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const renderContestDetails = () => {
    const contest = contests.find(c => c.id === selectedContestId);
    if (!contest) return null;
    const existingApp = currentUser ? applications.find(a => a.contestId === contest.id && a.userId === currentUser.id) : null;
    const StatusIcon = existingApp ? getStatusInfo(existingApp.status).icon : null;

    return (
      <div className="max-w-5xl mx-auto space-y-6 animate-in zoom-in-95 duration-300">
        <button onClick={() => setView('catalog')} className="flex items-center text-slate-500 hover:text-slate-800 transition">
          <ChevronLeft className="w-5 h-5 mr-1" /> Назад в каталог
        </button>

        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="relative h-64 md:h-80">
            <img src={contest.image} className="w-full h-full object-cover" alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-8 text-white">
              <div className="flex gap-3 mb-2">
                <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{getTypeLabel(contest.type)}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getContestStatusLabel(contest.status).color}`}>{getContestStatusLabel(contest.status).label}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold shadow-sm mb-2">{contest.title}</h1>
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                 <Briefcase className="w-4 h-4" /> Организатор: {contest.organizerName}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3">
             <div className="lg:col-span-2 p-8 border-r border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Описание</h3>
                <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-wrap">{contest.fullDescription}</p>

                <h3 className="text-xl font-bold text-slate-900 mb-4">Документы и задания</h3>
                <div className="space-y-3">
                  {contest.files?.map((f, i) => (
                    <div key={i} className="flex items-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer group">
                       <FileText className="w-8 h-8 text-slate-400 group-hover:text-blue-500 mr-4" />
                       <div>
                          <div className="font-medium text-slate-900 group-hover:text-blue-700">{f.name}</div>
                          <div className="text-xs text-slate-500">{f.size}</div>
                       </div>
                       <Download className="w-5 h-5 ml-auto text-slate-300 group-hover:text-blue-500" />
                    </div>
                  ))}
                </div>
             </div>

             <div className="p-8 bg-slate-50">
                {currentUser?.role === 'participant' ? (
                  <>
                    {existingApp ? (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getStatusInfo(existingApp.status).color.replace('text-', 'bg-').split(' ')[1]}`}>
                          {StatusIcon && <StatusIcon className={`w-8 h-8 ${getStatusInfo(existingApp.status).color.split(' ')[0]}`} />}
                        </div>
                        <div className="text-slate-500 text-sm font-medium mb-1">Статус заявки</div>
                        <div className={`text-xl font-bold mb-4 ${getStatusInfo(existingApp.status).color.split(' ')[0]}`}>{getStatusInfo(existingApp.status).label}</div>
                        
                        {contest.resultsPublished && existingApp.score !== undefined && (
                           <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                              <div className="text-slate-400 text-xs uppercase font-bold mb-1">Ваш результат</div>
                              <div className="text-3xl font-bold text-slate-800">{existingApp.score} <span className="text-sm text-slate-400 font-normal">баллов</span></div>
                           </div>
                        )}

                        <button onClick={() => setView('user_applications')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                           Перейти к заявкам
                        </button>
                      </div>
                    ) : (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Подать заявку</h3>
                        {contest.status === 'open' ? (
                          <div className="space-y-4">
                            <input 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="ФИО или Название команды"
                              value={applicationForm.name}
                              onChange={e => setApplicationForm({...applicationForm, name: e.target.value})}
                            />
                             <input 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="Класс / Группа"
                              value={applicationForm.group}
                              onChange={e => setApplicationForm({...applicationForm, group: e.target.value})}
                            />
                             <input 
                              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              placeholder="Email для связи"
                              value={applicationForm.email}
                              onChange={e => setApplicationForm({...applicationForm, email: e.target.value})}
                            />
                            <button onClick={handleApply} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition flex items-center justify-center gap-2">
                               Отправить заявку <Send className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-500">
                             Прием заявок на этот конкурс закрыт.
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                     <p className="text-slate-600 mb-4">Вы просматриваете как {currentUser?.role === 'organizer' ? 'Организатор' : 'Администратор'}</p>
                     <button onClick={() => setView(currentUser?.role === 'admin' ? 'admin_dashboard' : 'organizer_dashboard')} className="w-full py-3 border border-slate-300 rounded-xl font-bold hover:bg-slate-50 text-slate-700 transition">
                        Перейти в панель управления
                     </button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUserApplications = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <h2 className="text-3xl font-bold text-slate-900">Мои заявки</h2>
      <div className="space-y-4">
        {currentUser && applications.filter(a => a.userId === currentUser.id).map(app => {
          const contest = contests.find(c => c.id === app.contestId);
          const statusInfo = getStatusInfo(app.status);
          const StatusIcon = statusInfo.icon;
          const canDownloadCertificate = contest?.resultsPublished && (app.status === 'participant' || app.status === 'winner');
          const isWinner = app.status === 'winner';

          return (
             <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                   <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">{new Date(app.submissionDate).toLocaleDateString()}</span>
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">ID: {app.id}</span>
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 mb-1 cursor-pointer hover:text-blue-600" onClick={() => { setSelectedContestId(contest?.id!); setView('contest_details'); }}>{contest?.title}</h3>
                   <div className="text-slate-500 text-sm mb-4">Участник: {app.applicantName} ({app.group})</div>
                   
                   <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border ${statusInfo.color}`}>
                         <StatusIcon className="w-4 h-4" /> {statusInfo.label}
                      </span>
                      {contest?.resultsPublished && app.score !== undefined && (
                        <span className="text-slate-700 font-bold px-3">Результат: {app.score} баллов</span>
                      )}
                   </div>
                </div>

                {canDownloadCertificate && (
                   <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                      {isWinner && (
                         <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition">
                            <Trophy className="w-4 h-4" /> Скачать Диплом
                         </button>
                      )}
                      <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition">
                         <FileText className="w-4 h-4" /> Сертификат
                      </button>
                   </div>
                )}
             </div>
          );
        })}
        {currentUser && applications.filter(a => a.userId === currentUser.id).length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
             <p className="text-slate-500 mb-4">У вас пока нет заявок</p>
             <button onClick={() => setView('catalog')} className="text-blue-600 font-bold hover:underline">Перейти в каталог</button>
          </div>
        )}
      </div>
    </div>
  );

  const renderOrganizerDashboard = () => (
    <div className="space-y-8 animate-in fade-in">
       <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Панель Организатора</h2>
            <p className="text-slate-500 mt-1">Управление конкурсами и заявками</p>
          </div>
          <button onClick={() => setView('organizer_create')} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
             <Plus className="w-5 h-5" /> Создать конкурс
          </button>
       </div>

       <div className="grid grid-cols-1 gap-6">
          {currentUser && contests.filter(c => c.organizerId === currentUser.id).map(contest => {
            const contestApps = applications.filter(a => a.contestId === contest.id);
            const pendingApps = contestApps.filter(a => a.status === 'pending').length;

            return (
              <div key={contest.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors flex flex-col md:flex-row gap-6 items-start md:items-center">
                 <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={contest.image} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${getContestStatusLabel(contest.status).color}`}>
                          {getContestStatusLabel(contest.status).label}
                       </span>
                       <span className="text-xs text-slate-400">{getTypeLabel(contest.type)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{contest.title}</h3>
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                       <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {contest.startDate} — {contest.endDate}</span>
                       <span className="flex items-center"><Users className="w-4 h-4 mr-1"/> {contestApps.length} участников</span>
                    </div>
                 </div>
                 
                 <div className="flex flex-col items-end gap-3 min-w-[200px]">
                    {pendingApps > 0 && (
                       <div className="text-sm font-bold text-amber-600 flex items-center bg-amber-50 px-3 py-1 rounded-full animate-pulse">
                          {pendingApps} новых заявок
                       </div>
                    )}
                    <button 
                       onClick={() => { setSelectedContestId(contest.id); setOrganizerTab('applications'); setView('organizer_contest_details'); }}
                       className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition w-full"
                    >
                       Управление
                    </button>
                 </div>
              </div>
            );
          })}
       </div>
    </div>
  );

  const renderCreateContest = () => (
     <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-slate-100 animate-in slide-in-from-bottom-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Создание нового конкурса</h2>
        <div className="space-y-6">
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Название мероприятия</label>
              <input 
                 className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="Например: Олимпиада по физике 2024"
                 value={newContest.title || ''} 
                 onChange={e => setNewContest({...newContest, title: e.target.value})}
              />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Дата начала</label>
                 <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" value={newContest.startDate} onChange={e => setNewContest({...newContest, startDate: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2">Дата окончания</label>
                 <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500" value={newContest.endDate} onChange={e => setNewContest({...newContest, endDate: e.target.value})} />
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Тип конкурса</label>
              <div className="flex gap-2">
                 {['olympiad', 'hackathon', 'creative', 'sport'].map(t => (
                    <button key={t} onClick={() => setNewContest({...newContest, type: t as ContestType})}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${newContest.type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                       {getTypeLabel(t as ContestType)}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Описание</label>
              <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-32" placeholder="Краткое описание" value={newContest.description} onChange={e => setNewContest({...newContest, description: e.target.value})} />
           </div>

           <div className="pt-6 flex gap-4">
              <button onClick={() => setView('organizer_dashboard')} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">Отмена</button>
              <button onClick={handleCreateContest} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">Опубликовать конкурс</button>
           </div>
        </div>
     </div>
  );

  const renderContestManagement = () => {
     const contest = contests.find(c => c.id === selectedContestId);
     if (!contest) return null;
     const contestApps = applications.filter(a => a.contestId === contest.id);

     return (
        <div className="space-y-6 animate-in fade-in">
           <button onClick={() => setView('organizer_dashboard')} className="flex items-center text-slate-500 hover:text-slate-800 mb-4">
              <ChevronLeft className="w-4 h-4 mr-1" /> К списку конкурсов
           </button>
           
           <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-bold text-slate-900">{contest.title}</h2>
                 <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getContestStatusLabel(contest.status).color}`}>{getContestStatusLabel(contest.status).label}</span>
                    <span>Заявок: {contestApps.length}</span>
                    {contest.resultsPublished && <span className="text-green-600 font-bold flex items-center"><CheckCircle className="w-3 h-3 mr-1"/> Результаты опубликованы</span>}
                 </div>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                 <button onClick={() => setOrganizerTab('info')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${organizerTab === 'info' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Инфо</button>
                 <button onClick={() => setOrganizerTab('applications')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${organizerTab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Заявки ({contestApps.length})</button>
                 <button onClick={() => setOrganizerTab('results')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${organizerTab === 'results' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Публикация</button>
              </div>
           </div>

           {organizerTab === 'applications' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                       <tr>
                          <th className="px-6 py-4">Участник</th>
                          <th className="px-6 py-4">Группа</th>
                          <th className="px-6 py-4">Статус</th>
                          <th className="px-6 py-4">Оценка (0-100)</th>
                          <th className="px-6 py-4 text-right">Действия</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {contestApps.map(app => (
                          <tr key={app.id} className="hover:bg-slate-50 transition">
                             <td className="px-6 py-4 font-medium text-slate-900">{app.applicantName}</td>
                             <td className="px-6 py-4 text-slate-500">{app.group}</td>
                             <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusInfo(app.status).color}`}>{getStatusInfo(app.status).label}</span>
                             </td>
                             <td className="px-6 py-4">
                                <input 
                                   type="number" className="w-16 px-2 py-1 border border-slate-300 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none" 
                                   placeholder="-" 
                                   value={app.score ?? ''}
                                   onChange={e => handleUpdateScore(app.id, parseInt(e.target.value))}
                                />
                             </td>
                             <td className="px-6 py-4 text-right space-x-2">
                                <button onClick={() => handleUpdateAppStatus(app.id, 'approved')} title="Принять" className="p-1.5 hover:bg-green-100 text-green-600 rounded"><CheckCircle className="w-5 h-5"/></button>
                                <button onClick={() => handleUpdateAppStatus(app.id, 'rejected')} title="Отклонить" className="p-1.5 hover:bg-red-100 text-red-600 rounded"><X className="w-5 h-5"/></button>
                                <button onClick={() => handleUpdateAppStatus(app.id, 'winner')} title="Сделать победителем" className={`p-1.5 rounded ${app.status === 'winner' ? 'bg-amber-100 text-amber-600' : 'hover:bg-amber-50 text-slate-400 hover:text-amber-600'}`}><Trophy className="w-5 h-5"/></button>
                             </td>
                          </tr>
                       ))}
                       {contestApps.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Заявок пока нет</td></tr>}
                    </tbody>
                 </table>
              </div>
           )}

           {organizerTab === 'results' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-2xl mx-auto">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><Award className="w-8 h-8"/></div>
                 <h3 className="text-xl font-bold text-slate-900 mb-2">Публикация результатов</h3>
                 <p className="text-slate-500 mb-8">
                    После публикации результаты станут доступны всем участникам в личных кабинетах. 
                    Победители смогут скачать дипломы, участники — сертификаты.
                    Действие необратимо.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-8 text-left bg-slate-50 p-4 rounded-xl">
                    <div>
                       <div className="text-xs text-slate-400 uppercase font-bold">Всего участников</div>
                       <div className="text-2xl font-bold">{contestApps.filter(a => a.status === 'participant' || a.status === 'winner').length}</div>
                    </div>
                    <div>
                       <div className="text-xs text-slate-400 uppercase font-bold">Победителей</div>
                       <div className="text-2xl font-bold text-amber-600">{contestApps.filter(a => a.status === 'winner').length}</div>
                    </div>
                 </div>

                 {contest.resultsPublished ? (
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-100 text-green-700 rounded-xl font-bold">
                       <CheckCircle className="w-5 h-5"/> Результаты уже опубликованы
                    </div>
                 ) : (
                    <button onClick={() => handlePublishResults(contest.id)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition">
                       Опубликовать результаты
                    </button>
                 )}
              </div>
           )}

           {organizerTab === 'info' && (
             <div className="bg-white rounded-2xl p-8 border border-slate-200 text-slate-500 text-center">
                Здесь можно редактировать описание, сроки и файлы конкурса. (В разработке для MVP)
             </div>
           )}
        </div>
     );
  };

  const renderAdminDashboard = () => (
     <div className="space-y-8 animate-in fade-in">
        <h2 className="text-3xl font-bold text-slate-900">Административная панель</h2>

        {/* Stats MVP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-sm font-medium mb-1">Всего пользователей</div>
              <div className="text-3xl font-bold text-slate-900">{users.length}</div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-sm font-medium mb-1">Конкурсов</div>
              <div className="text-3xl font-bold text-slate-900">{contests.length}</div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-sm font-medium mb-1">Активных заявок</div>
              <div className="text-3xl font-bold text-blue-600">{applications.filter(a => a.status !== 'rejected').length}</div>
           </div>
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-slate-400 text-sm font-medium mb-1">Школ/Организаций</div>
              <div className="text-3xl font-bold text-slate-900">12</div>
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">Управление пользователями</div>
           <table className="w-full text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white">
                 <tr>
                    <th className="px-6 py-3 font-semibold">Имя</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Роль</th>
                    <th className="px-6 py-3 font-semibold text-right">Действия</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium">{u.name}</td>
                       <td className="px-6 py-4 text-slate-500">{u.email}</td>
                       <td className="px-6 py-4">
                          <select 
                             className="bg-slate-100 border-none rounded px-2 py-1 text-sm font-medium text-slate-700 outline-none"
                             value={u.role}
                             onChange={(e) => setUsers(users.map(us => us.id === u.id ? {...us, role: e.target.value as UserRole} : us))}
                          >
                             <option value="participant">Участник</option>
                             <option value="organizer">Организатор</option>
                             <option value="admin">Админ</option>
                          </select>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">Все конкурсы</div>
           <table className="w-full text-left">
              <thead className="text-xs text-slate-400 uppercase bg-white">
                 <tr>
                    <th className="px-6 py-3 font-semibold">Название</th>
                    <th className="px-6 py-3 font-semibold">Организатор</th>
                    <th className="px-6 py-3 font-semibold">Статус</th>
                    <th className="px-6 py-3 font-semibold text-right">Действия</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {contests.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50">
                       <td className="px-6 py-4 font-medium">{c.title}</td>
                       <td className="px-6 py-4 text-slate-500">{c.organizerName}</td>
                       <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getContestStatusLabel(c.status).color}`}>{getContestStatusLabel(c.status).label}</span>
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteContest(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4"/></button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-blue-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div 
               className="flex items-center gap-2.5 font-bold text-2xl tracking-tight text-blue-900 cursor-pointer"
               onClick={() => { if(isLoggedIn) setView('catalog'); }}
            >
               <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                  <Trophy className="w-5 h-5" strokeWidth={3} />
               </div>
               EduContest
            </div>

            {isLoggedIn && (
              <div className="hidden md:flex bg-slate-100/80 p-1 rounded-xl gap-1">
                 <button onClick={() => setView('catalog')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'catalog' || view === 'contest_details' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>Каталог</button>
                 
                 {currentUser?.role === 'participant' && (
                    <button onClick={() => setView('user_applications')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'user_applications' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>Мои заявки</button>
                 )}
                 {currentUser?.role === 'organizer' && (
                    <button onClick={() => setView('organizer_dashboard')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view.startsWith('organizer') ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>Организатор</button>
                 )}
                 {currentUser?.role === 'admin' && (
                    <button onClick={() => setView('admin_dashboard')} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === 'admin_dashboard' ? 'bg-white shadow text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}>Админ</button>
                 )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
             {isLoggedIn && currentUser ? (
               <div className="pl-4 border-l border-slate-200 flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                     <div className="text-sm font-bold text-slate-900 leading-none mb-1">{currentUser.name}</div>
                     <div className="text-xs font-medium text-slate-500 uppercase">{currentUser.role === 'participant' ? 'Участник' : currentUser.role === 'organizer' ? 'Организатор' : 'Администратор'}</div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md ring-4 ring-slate-50 cursor-pointer" title="Профиль">
                     {currentUser.name[0]}
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Выйти">
                     <LogOut className="w-5 h-5" />
                  </button>
               </div>
             ) : (
                <div className="text-sm text-slate-500">
                   {/* Placeholder for unauthorized state header content if needed */}
                </div>
             )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-8 pb-32">
         {view === 'catalog' && renderCatalog()}
         {view === 'contest_details' && renderContestDetails()}
         {view === 'user_applications' && renderUserApplications()}
         {view === 'organizer_dashboard' && renderOrganizerDashboard()}
         {view === 'organizer_create' && renderCreateContest()}
         {view === 'organizer_contest_details' && renderContestManagement()}
         {view === 'admin_dashboard' && renderAdminDashboard()}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);