import React, { useState, useEffect } from 'react';
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
  Filter
} from 'lucide-react';

// --- Types ---

type UserRole = 'participant' | 'organizer';

type ContestType = 'olympiad' | 'creative' | 'sport' | 'hackathon';

interface Contest {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  type: ContestType;
  startDate: string;
  endDate: string;
  organizer: string;
  image: string;
  status: 'open' | 'closed' | 'judging' | 'completed';
}

interface Application {
  id: string;
  contestId: string;
  applicantName: string;
  group: string; // class or group
  email: string;
  status: 'pending' | 'approved' | 'rejected' | 'winner' | 'participant';
  submissionDate: string;
}

// --- Mock Data ---

const INITIAL_CONTESTS: Contest[] = [
  {
    id: '1',
    title: 'Математическая Олимпиада "Пифагор"',
    description: 'Ежегодная олимпиада для школьников 5-11 классов. Проверь свои знания!',
    fullDescription: 'Приглашаем всех любителей математики принять участие в нашей ежегодной олимпиаде. Вас ждут нестандартные задачи, логические головоломки и ценные призы. Победители получат льготы при поступлении в профильные вузы.',
    type: 'olympiad',
    startDate: '2023-11-01',
    endDate: '2023-11-20',
    organizer: 'Лицей №5',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    status: 'open'
  },
  {
    id: '2',
    title: 'Хакатон "Code Future 2024"',
    description: 'Командное соревнование по разработке веб-приложений за 48 часов.',
    fullDescription: 'Собери команду и создай прототип будущего! Темы: Образование, Экология, Умный город. Жюри состоит из экспертов ведущих IT-компаний. Главный приз - стажировка.',
    type: 'hackathon',
    startDate: '2023-12-10',
    endDate: '2023-12-12',
    organizer: 'IT-парк "Горизонт"',
    image: 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=800',
    status: 'open'
  },
  {
    id: '3',
    title: 'Конкурс Рисунков "Зимняя Сказка"',
    description: 'Творческий конкурс для всех возрастов. Тема: зима и новогоднее чудо.',
    fullDescription: 'Принимаются работы в любой технике: акварель, гуашь, масло, цифровая живопись. Лучшие работы будут выставлены в городской галерее.',
    type: 'creative',
    startDate: '2023-12-01',
    endDate: '2023-12-25',
    organizer: 'Дом Культуры',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800',
    status: 'open'
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'a1',
    contestId: '1',
    applicantName: 'Иван Иванов',
    group: '9Б',
    email: 'ivan@example.com',
    status: 'winner',
    submissionDate: '2023-11-02'
  },
  {
    id: 'a2',
    contestId: '2',
    applicantName: 'Команда "Ракета"',
    group: 'Курс 2',
    email: 'rocket@example.com',
    status: 'pending',
    submissionDate: '2023-12-10'
  }
];

// --- Components ---

interface User {
  id: number;
  login: string;
  role: string;
  created_at: string;
}

const App = () => {
  const [role, setRole] = useState<UserRole>('participant');
  const [view, setView] = useState<'catalog' | 'details' | 'create' | 'dashboard' | 'my-applications' | 'auth'>('catalog');
  const [contests, setContests] = useState<Contest[]>(INITIAL_CONTESTS);
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  
  // Create Contest State
  const [newContest, setNewContest] = useState<Partial<Contest>>({ type: 'olympiad' });

  // Application Form State
  const [applicationForm, setApplicationForm] = useState({ name: '', group: '', email: '' });

  // Auth Form State
  const [loginForm, setLoginForm] = useState({ login: '', password: '', role: 'Студент' });
  const [registerForm, setRegisterForm] = useState({ login: '', email: '', password: '', role: 'Студент' });
  const [authError, setAuthError] = useState<string>('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const activeContest = contests.find(c => c.id === selectedContestId);

  // --- Handlers ---

  const handleCreateContest = () => {
    if (!newContest.title || !newContest.description) return;
    
    const contest: Contest = {
      id: Date.now().toString(),
      title: newContest.title || '',
      description: newContest.description || '',
      fullDescription: newContest.fullDescription || newContest.description || '',
      type: newContest.type as ContestType || 'olympiad',
      startDate: newContest.startDate || new Date().toISOString().split('T')[0],
      endDate: newContest.endDate || new Date().toISOString().split('T')[0],
      organizer: 'Организатор',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', // default image
      status: 'open'
    };
    
    setContests([contest, ...contests]);
    setView('dashboard');
    setNewContest({ type: 'olympiad' });
  };

  const handleApply = () => {
    if (!applicationForm.name || !selectedContestId) return;

    const newApp: Application = {
      id: Date.now().toString(),
      contestId: selectedContestId,
      applicantName: applicationForm.name,
      group: applicationForm.group,
      email: applicationForm.email,
      status: 'pending',
      submissionDate: new Date().toISOString().split('T')[0]
    };

    setApplications([...applications, newApp]);
    setApplicationForm({ name: '', group: '', email: '' });
    setView('my-applications');
  };

  const handleUpdateStatus = (appId: string, newStatus: Application['status']) => {
    setApplications(applications.map(app => 
      app.id === appId ? { ...app, status: newStatus } : app
    ));
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

  const getStatusColor = (status: Application['status']) => {
    switch(status) {
      case 'winner': return 'text-yellow-600 bg-yellow-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'participant': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status: Application['status']) => {
    switch(status) {
      case 'winner': return 'Победитель';
      case 'approved': return 'Принята';
      case 'rejected': return 'Отклонена';
      case 'participant': return 'Участник';
      case 'pending': return 'На проверке';
      default: return status;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const isEmail = loginForm.login.includes('@');
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [isEmail ? 'email' : 'login']: loginForm.login,
          password: loginForm.password,
          role: loginForm.role
        })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setView('catalog');
        setRole(userData.role === 'Организатор' ? 'organizer' : 'participant');
      } else {
        const error = await response.json();
        setAuthError(error.detail || 'Ошибка входа');
      }
    } catch (error) {
      setAuthError('Ошибка подключения к серверу');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setView('catalog');
        setRole(userData.role === 'Организатор' ? 'organizer' : 'participant');
      } else {
        const error = await response.json();
        setAuthError(error.detail || 'Ошибка регистрации');
      }
    } catch (error) {
      setAuthError('Ошибка подключения к серверу');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setView('catalog');
  };

  // --- Views ---

  const renderCatalog = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-slate-800">Каталог Конкурсов</h2>
        <div className="flex gap-2">
          {['all', 'olympiad', 'creative', 'hackathon'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm hover:bg-slate-50 transition">
              {filter === 'all' ? 'Все' : getTypeLabel(filter as ContestType)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map(contest => (
          <div key={contest.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition cursor-pointer group"
               onClick={() => { setSelectedContestId(contest.id); setView('details'); }}>
            <div className="h-48 overflow-hidden relative">
              <img src={contest.image} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-blue-800">
                {getTypeLabel(contest.type)}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{contest.title}</h3>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{contest.description}</p>
              <div className="flex items-center text-slate-400 text-sm space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>до {new Date(contest.endDate).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{applications.filter(a => a.contestId === contest.id).length} заявок</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetails = () => {
    if (!activeContest) return null;
    const isApplied = applications.some(a => a.contestId === activeContest.id && role === 'participant'); // Simple check, usually needs user ID

    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-64 md:h-80 relative">
          <img src={activeContest.image} alt={activeContest.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                 <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">{getTypeLabel(activeContest.type)}</span>
                 <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase">{activeContest.status === 'open' ? 'Идет прием заявок' : 'Завершен'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{activeContest.title}</h1>
            </div>
          </div>
          <button onClick={() => setView('catalog')} className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Описание</h3>
              <p className="text-slate-600 leading-relaxed">{activeContest.fullDescription}</p>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Документы и материалы</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-blue-600 hover:underline cursor-pointer">
                  <FileText className="w-5 h-5 mr-2" />
                  Положение о конкурсе.pdf
                </li>
                <li className="flex items-center text-blue-600 hover:underline cursor-pointer">
                  <FileText className="w-5 h-5 mr-2" />
                  Образец заявки.docx
                </li>
              </ul>
            </div>

            {role === 'participant' && (
              <div className="pt-4">
                {isApplied ? (
                   <div className="bg-green-50 text-green-800 p-4 rounded-xl flex items-center">
                     <CheckCircle className="w-6 h-6 mr-3" />
                     <div>
                       <p className="font-bold">Вы уже подали заявку!</p>
                       <button onClick={() => setView('my-applications')} className="text-sm underline mt-1">Перейти к заявкам</button>
                     </div>
                   </div>
                ) : (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Подать заявку</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">ФИО Участника / Название Команды</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Иванов Иван Иванович"
                          value={applicationForm.name}
                          onChange={(e) => setApplicationForm({...applicationForm, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Класс / Группа</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="10 А"
                            value={applicationForm.group}
                            onChange={(e) => setApplicationForm({...applicationForm, group: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                          <input 
                            type="email" 
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="mail@example.com"
                            value={applicationForm.email}
                            onChange={(e) => setApplicationForm({...applicationForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      <button 
                        onClick={handleApply}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Отправить заявку
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Информация</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-slate-500 mb-1">Организатор</div>
                  <div className="font-medium text-slate-800 flex items-center">
                    <Award className="w-4 h-4 mr-2 text-blue-500" />
                    {activeContest.organizer}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Даты проведения</div>
                  <div className="font-medium text-slate-800">
                    {new Date(activeContest.startDate).toLocaleDateString('ru-RU')} - {new Date(activeContest.endDate).toLocaleDateString('ru-RU')}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 mb-1">Тип</div>
                  <div className="font-medium text-slate-800">{getTypeLabel(activeContest.type)}</div>
                </div>
              </div>
            </div>
            
            {role === 'organizer' && (
               <button onClick={() => setView('dashboard')} className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition">
                 Управление конкурсом
               </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCreateContest = () => (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Создать новый конкурс</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Название конкурса</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Например: Олимпиада по Физике"
            value={newContest.title || ''}
            onChange={(e) => setNewContest({...newContest, title: e.target.value})}
          />
        </div>
        
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1">Тип</label>
           <select 
             className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
             value={newContest.type}
             onChange={(e) => setNewContest({...newContest, type: e.target.value as ContestType})}
           >
             <option value="olympiad">Олимпиада</option>
             <option value="hackathon">Хакатон</option>
             <option value="creative">Творческий конкурс</option>
             <option value="sport">Спортивное соревнование</option>
           </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Краткое описание</label>
          <textarea 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-24"
            placeholder="Что это за конкурс?"
            value={newContest.description || ''}
            onChange={(e) => setNewContest({...newContest, description: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Полные правила и условия</label>
          <textarea 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none h-40"
            placeholder="Подробное описание..."
            value={newContest.fullDescription || ''}
            onChange={(e) => setNewContest({...newContest, fullDescription: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Дата начала</label>
            <input 
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newContest.startDate}
              onChange={(e) => setNewContest({...newContest, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Дата окончания</label>
            <input 
              type="date"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              value={newContest.endDate}
              onChange={(e) => setNewContest({...newContest, endDate: e.target.value})}
            />
          </div>
        </div>

        <button 
          onClick={handleCreateContest}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
        >
          Опубликовать конкурс
        </button>
      </div>
    </div>
  );

  const renderOrganizerDashboard = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-800">Панель Организатора</h2>
        <button onClick={() => setView('create')} className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          <Plus className="w-5 h-5 mr-2" />
          Создать конкурс
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-700">Заявки на рассмотрении</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Участник</th>
                <th className="px-6 py-3 font-medium">Конкурс</th>
                <th className="px-6 py-3 font-medium">Статус</th>
                <th className="px-6 py-3 font-medium text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map(app => {
                const contest = contests.find(c => c.id === app.contestId);
                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{app.applicantName}</div>
                      <div className="text-xs text-slate-500">{app.group} • {app.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{contest?.title}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                       {app.status === 'pending' && (
                         <>
                           <button onClick={() => handleUpdateStatus(app.id, 'participant')} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Принять</button>
                           <button onClick={() => handleUpdateStatus(app.id, 'rejected')} className="text-red-600 hover:text-red-800 font-medium text-sm">Отклонить</button>
                         </>
                       )}
                       {app.status === 'participant' && (
                          <button onClick={() => handleUpdateStatus(app.id, 'winner')} className="text-yellow-600 hover:text-yellow-800 font-medium text-sm flex items-center justify-end w-full">
                            <Trophy className="w-4 h-4 mr-1" /> В победители
                          </button>
                       )}
                    </td>
                  </tr>
                );
              })}
              {applications.length === 0 && (
                <tr><td colSpan={4} className="text-center py-8 text-slate-500">Заявок пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAuth = () => (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-blue-900 px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setAuthTab('login'); setAuthError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              authTab === 'login'
                ? 'bg-white text-blue-900'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => { setAuthTab('register'); setAuthError(''); }}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
              authTab === 'register'
                ? 'bg-white text-blue-900'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            Регистрация
          </button>
        </div>
      </div>

      <div className="p-6">
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {authError}
          </div>
        )}

        {authTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Войти как</label>
              <select
                value={loginForm.role}
                onChange={(e) => setLoginForm({...loginForm, role: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="Студент">Студент</option>
                <option value="Организатор">Организатор</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Логин или Email</label>
              <input
                type="text"
                value={loginForm.login}
                onChange={(e) => setLoginForm({...loginForm, login: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите логин или email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите пароль"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Войти
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Регистрация как</label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm({...registerForm, role: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="Студент">Студент</option>
                <option value="Организатор">Организатор</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Логин</label>
              <input
                type="text"
                value={registerForm.login}
                onChange={(e) => setRegisterForm({...registerForm, login: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите логин (мин. 3 символа)"
                required
                minLength={3}
                maxLength={25}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Пароль</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Введите пароль (мин. 8 символов)"
                required
                minLength={8}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-md hover:shadow-lg"
            >
              Зарегистрироваться
            </button>
          </form>
        )}
      </div>
    </div>
  );

  const renderParticipantDashboard = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-slate-800">Мои Заявки</h2>
      <div className="space-y-4">
        {applications.filter(app => !('userId' in app) /* In a real app check ID */).map(app => { // Showing all for demo
          const contest = contests.find(c => c.id === app.contestId);
          return (
            <div key={app.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                 <div className="text-sm text-slate-500 mb-1">{new Date(app.submissionDate).toLocaleDateString('ru-RU')}</div>
                 <h3 className="text-lg font-bold text-slate-900 mb-1">{contest?.title}</h3>
                 <p className="text-sm text-slate-600">Участник: {app.applicantName}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`px-4 py-2 rounded-lg text-sm font-medium ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </div>
                
                {app.status === 'winner' && (
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">
                    <Download className="w-4 h-4" />
                    <span className="hidden md:inline">Сертификат</span>
                  </button>
                )}
                 {app.status === 'participant' && (
                  <button className="flex items-center gap-2 border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition">
                    <Download className="w-4 h-4" />
                    <span className="hidden md:inline">Сертификат участника</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
         {applications.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
               <p className="text-slate-500 mb-4">У вас пока нет активных заявок.</p>
               <button onClick={() => setView('catalog')} className="text-blue-600 font-medium hover:underline">Перейти в каталог</button>
            </div>
         )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navbar */}
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div 
              className="flex items-center space-x-2 font-bold text-xl tracking-tight cursor-pointer"
              onClick={() => setView('catalog')}
            >
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>EduContest</span>
            </div>
            
            <div className="hidden md:flex space-x-6 text-sm font-medium text-blue-100">
              <button onClick={() => setView('catalog')} className={`hover:text-white transition ${view === 'catalog' ? 'text-white' : ''}`}>Каталог</button>
              {role === 'organizer' && (
                 <button onClick={() => setView('dashboard')} className={`hover:text-white transition ${view === 'dashboard' ? 'text-white' : ''}`}>Администрирование</button>
              )}
              {role === 'participant' && (
                 <button onClick={() => setView('my-applications')} className={`hover:text-white transition ${view === 'my-applications' ? 'text-white' : ''}`}>Мои Заявки</button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="text-sm text-blue-100">
                  <span className="opacity-70">Привет,</span> <span className="font-semibold">{user.login}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
                >
                  Выйти
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-sm font-bold">
                  {user.role === 'Организатор' ? 'A' : 'U'}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setView('auth'); setAuthTab('login'); }}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-lg text-sm font-medium transition"
                >
                  Войти
                </button>
                <button
                  onClick={() => { setView('auth'); setAuthTab('register'); }}
                  className="px-4 py-2 bg-white text-blue-900 hover:bg-blue-50 rounded-lg text-sm font-medium transition"
                >
                  Регистрироваться
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'auth' && renderAuth()}
        {view === 'catalog' && renderCatalog()}
        {view === 'details' && renderDetails()}
        {view === 'create' && renderCreateContest()}
        {view === 'dashboard' && renderOrganizerDashboard()}
        {view === 'my-applications' && renderParticipantDashboard()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
         <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
           <p className="mb-2">© 2023 EduContest. Единый портал образовательных конкурсов.</p>
           <p>Сделано для хакатона.</p>
         </div>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
