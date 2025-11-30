import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp, useThemeClasses } from '../store';
import { 
    ChevronLeft, FileText, Download, Send, CheckCircle, X, Trophy, 
    Calendar, Users, Plus, Award, Trash2, Save, Camera, Eye, EyeOff,
    Briefcase, User
} from 'lucide-react';
import { LazyImage, StatusBadge } from '../components/Shared.tsx';
import { getTypeLabel } from '../mockData';
import { ContestType, UserRole } from '../types';

// --- Contest Details ---
export const ContestDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { contests, applications, currentUser, applyForContest, t, language } = useApp();
    const theme = useThemeClasses();
    const contest = contests.find(c => c.id === id);
    const [form, setForm] = useState({ name: '', group: '', email: '' });

    if (!contest) return <div>Not Found</div>;

    const existingApp = currentUser ? applications.find(a => a.contestId === contest.id && a.userId === currentUser.id) : null;
    
    const handleApply = () => {
        if(form.name && form.email) applyForContest(contest.id, form.name, form.group, form.email);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition group">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition" /> {t('back')}
            </button>
            
            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="relative h-64 md:h-80">
                    <LazyImage src={contest.image} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8 text-white">
                        <div className="flex gap-3 mb-2">
                            <span className={`${theme.bg} px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm`}>{getTypeLabel(contest.type, language)}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold shadow-sm mb-2 leading-tight">{contest.title}</h1>
                         <div className="flex items-center gap-2 text-slate-300 text-sm">
                             <Briefcase className="w-4 h-4" /> {t('organizer')}: {contest.organizerName}
                          </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="lg:col-span-2 p-8 border-r border-slate-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400"/> {t('description')}</h3>
                        <p className="text-slate-600 leading-relaxed mb-8 whitespace-pre-wrap text-lg">{contest.fullDescription}</p>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-4">{t('files')}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {contest.files?.map((f, i) => (
                                <div key={i} className={`flex items-center p-4 rounded-xl bg-slate-50 border border-slate-200 hover:${theme.lightBg} hover:${theme.border} transition cursor-pointer group`}>
                                    <div className="bg-white p-2 rounded-lg mr-3 shadow-sm text-slate-400 group-hover:text-blue-500 transition">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 truncate group-hover:text-blue-700 transition">{f.name}</div>
                                        <div className="text-xs text-slate-500">{f.size}</div>
                                    </div>
                                    <Download className={`w-5 h-5 text-slate-300 ${theme.textHover}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-slate-50/50">
                        {!currentUser ? (
                             <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center sticky top-24">
                                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600"><User className="w-8 h-8"/></div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('loginToApplyTitle')}</h3>
                                <p className="text-slate-500 mb-6">{t('loginToApplyDesc')}</p>
                                <button onClick={() => navigate('/login')} className={`w-full py-3 ${theme.buttonPrimary} rounded-xl font-bold shadow-lg`}>
                                    {t('login')}
                                </button>
                            </div>
                        ) : currentUser.role === 'participant' ? (
                            <>
                                {existingApp ? (
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center sticky top-24">
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Application Status</div>
                                        <div className="flex justify-center mb-6">
                                            <StatusBadge status={existingApp.status} className="text-base px-4 py-1.5" />
                                        </div>
                                        
                                        {contest.resultsPublished && existingApp.score !== undefined && (
                                            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                <div className="text-slate-400 text-xs uppercase font-bold mb-1">Your Score</div>
                                                <div className="text-4xl font-black text-slate-800">{existingApp.score} <span className="text-base text-slate-400 font-normal">pts</span></div>
                                            </div>
                                        )}

                                        <button onClick={() => navigate('/dashboard')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">{t('myApps')}</button>
                                    </div>
                                ) : (
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4">{t('apply')}</h3>
                                        {contest.status === 'open' ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
                                                    <input className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 ${theme.focusRing} outline-none transition`} placeholder="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Class / Group</label>
                                                    <input className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 ${theme.focusRing} outline-none transition`} placeholder="Group" value={form.group} onChange={e => setForm({...form, group: e.target.value})} />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Contact Email</label>
                                                    <input className={`w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 ${theme.focusRing} outline-none transition`} placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                                                </div>
                                                <button onClick={handleApply} className={`w-full py-4 ${theme.buttonPrimary} rounded-xl font-bold flex items-center justify-center gap-2 mt-2`}>{t('apply')} <Send className="w-4 h-4" /></button>
                                            </div>
                                        ) : <div className="text-center py-8 text-slate-500 font-medium">{t('statusClosed')}</div>}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center sticky top-24">
                                <p className="text-slate-500 mb-6">You are viewing this contest as <span className="font-bold text-slate-900">{t(currentUser?.role || 'admin')}</span></p>
                                <button onClick={() => navigate(currentUser?.role === 'admin' ? '/admin' : '/organizer')} className="w-full py-3 border-2 border-slate-200 rounded-xl font-bold hover:border-slate-400 text-slate-700 transition">{t('manage')}</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- User Dashboard ---
export const UserDashboard = () => {
    const { currentUser, applications, contests, t } = useApp();
    const navigate = useNavigate();
    const theme = useThemeClasses();

    const myApps = applications.filter(a => a.userId === currentUser?.id);

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            <h2 className="text-3xl font-bold text-slate-900">{t('myApps')}</h2>
            
            <div className="space-y-4">
                {myApps.map(app => {
                    const contest = contests.find(c => c.id === app.contestId);
                    const isWinner = app.status === 'winner';
                    const canDownload = contest?.resultsPublished && (app.status === 'participant' || isWinner);

                    return (
                        <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 hover:shadow-md transition group">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                     <span className="text-xs text-slate-400 font-medium">{new Date(app.submissionDate).toLocaleDateString()}</span>
                                     <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">ID: {app.id}</span>
                                </div>
                                <h3 className={`text-xl font-bold text-slate-900 mb-2 cursor-pointer ${theme.textHover} transition`} onClick={() => navigate(`/contest/${app.contestId}`)}>{contest?.title}</h3>
                                <div className="flex flex-wrap items-center gap-3">
                                    <StatusBadge status={app.status} />
                                    {contest?.resultsPublished && app.score && (
                                        <span className="font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs">Score: {app.score}</span>
                                    )}
                                </div>
                            </div>

                            {canDownload && (
                                <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                    {isWinner && (
                                        <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition hover:-translate-y-0.5">
                                            <Trophy className="w-4 h-4" /> {t('downloadDiploma')}
                                        </button>
                                    )}
                                    <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition">
                                        <FileText className="w-4 h-4" /> {t('downloadCert')}
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                {myApps.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><FileText className="w-8 h-8"/></div>
                        <p className="text-slate-500 mb-4 font-medium">No applications found</p>
                        <button onClick={() => navigate('/')} className={`${theme.text} font-bold hover:underline`}>{t('findContest')}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Organizer Dashboard ---
export const OrganizerDashboard = () => {
    const { currentUser, contests, applications, createContest, updateApplicationStatus, updateApplicationScore, publishResults, t } = useApp();
    const theme = useThemeClasses();
    const [view, setView] = useState<'list' | 'create'>('list');
    const [selectedContestId, setSelectedContestId] = useState<string | null>(null);
    const [newContest, setNewContest] = useState<any>({ type: 'olympiad' });

    const myContests = contests.filter(c => c.organizerId === currentUser?.id);
    const selectedContest = contests.find(c => c.id === selectedContestId);
    const selectedApps = applications.filter(a => a.contestId === selectedContestId);

    if (view === 'create') {
        return (
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-lg border border-slate-100 animate-slide-up pb-20">
                <h2 className="text-2xl font-bold mb-8 text-slate-900">{t('createContest')}</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                        <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ex: Math Olympiad 2024" value={newContest.title || ''} onChange={e => setNewContest({...newContest, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Start Date</label>
                            <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition" onChange={e => setNewContest({...newContest, startDate: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">End Date</label>
                            <input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition" onChange={e => setNewContest({...newContest, endDate: e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                        <div className="flex gap-2 flex-wrap">
                             {['olympiad', 'hackathon', 'creative', 'sport'].map(type => (
                                 <button key={type} onClick={() => setNewContest({...newContest, type})} className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${newContest.type === type ? theme.buttonPrimary : 'bg-white border-slate-200 text-slate-600'}`}>{type}</button>
                             ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                        <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 h-32 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition resize-none" placeholder="..." onChange={e => setNewContest({...newContest, description: e.target.value})} />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button onClick={() => setView('list')} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition">{t('cancel')}</button>
                        <button onClick={() => { createContest(newContest); setView('list'); }} className={`flex-[2] py-3 ${theme.buttonPrimary} rounded-xl font-bold shadow-lg`}>{t('save')}</button>
                    </div>
                </div>
            </div>
        );
    }

    if (selectedContest) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <button onClick={() => setSelectedContestId(null)} className="flex items-center text-slate-500 hover:text-slate-900 transition mb-4 font-medium"><ChevronLeft className="w-4 h-4 mr-1"/> {t('back')}</button>
                
                <div className="bg-white rounded-2xl p-8 flex justify-between items-center shadow-sm border border-slate-200 flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{selectedContest.title}</h2>
                        <div className="flex items-center gap-4 mt-2">
                             {selectedContest.resultsPublished 
                                ? <div className="text-green-600 font-bold flex items-center bg-green-50 px-3 py-1 rounded-full text-sm"><CheckCircle className="w-4 h-4 mr-1"/> Results Published</div>
                                : <div className="text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full text-sm">Results Pending</div>
                             }
                             <div className="text-slate-500 text-sm">{selectedApps.length} Applications</div>
                        </div>
                    </div>
                    {!selectedContest.resultsPublished && (
                        <button onClick={() => publishResults(selectedContest.id)} className={`px-6 py-3 ${theme.buttonPrimary} rounded-xl font-bold shadow-lg`}>{t('publishResults')}</button>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Participant</th>
                                    <th className="px-6 py-4">Group</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Score</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {selectedApps.map(app => (
                                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4 font-medium text-slate-900">{app.applicantName}<div className="text-xs text-slate-400 font-normal">{app.email}</div></td>
                                        <td className="px-6 py-4 text-slate-600">{app.group}</td>
                                        <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                                        <td className="px-6 py-4"><input type="number" className="w-16 px-2 py-1 border border-slate-200 rounded text-center focus:ring-2 focus:ring-blue-500 outline-none" value={app.score || ''} onChange={e => updateApplicationScore(app.id, parseInt(e.target.value))} placeholder="-" /></td>
                                        <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                            <button onClick={() => updateApplicationStatus(app.id, 'approved')} title="Approve" className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition"><CheckCircle className="w-5 h-5"/></button>
                                            <button onClick={() => updateApplicationStatus(app.id, 'rejected')} title="Reject" className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"><X className="w-5 h-5"/></button>
                                            <button onClick={() => updateApplicationStatus(app.id, 'winner')} title="Winner" className={`p-2 rounded-lg transition ${app.status === 'winner' ? 'bg-amber-100 text-amber-600' : 'hover:bg-amber-50 text-slate-400 hover:text-amber-600'}`}><Trophy className="w-5 h-5"/></button>
                                        </td>
                                    </tr>
                                ))}
                                {selectedApps.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">No applications yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">{t('organizerPanel')}</h2>
                    <p className="text-slate-500 mt-1">Manage your contests and applications</p>
                </div>
                <button onClick={() => setView('create')} className={`flex items-center gap-2 ${theme.buttonPrimary} px-6 py-3 rounded-xl font-bold shadow-lg transition transform hover:-translate-y-0.5`}><Plus className="w-5 h-5"/> {t('createContest')}</button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {myContests.map(c => {
                     const appCount = applications.filter(a => a.contestId === c.id).length;
                     return (
                         <div key={c.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-blue-300 transition-colors group">
                             <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm"><LazyImage src={c.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" /></div>
                             <div className="flex-1 min-w-0">
                                 <h3 className="text-xl font-bold text-slate-900 truncate">{c.title}</h3>
                                 <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                                     <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><Calendar className="w-4 h-4 mr-1.5 text-slate-400"/> {c.endDate}</span>
                                     <span className="flex items-center bg-slate-50 px-2 py-1 rounded-md"><Users className="w-4 h-4 mr-1.5 text-slate-400"/> {appCount} apps</span>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedContestId(c.id)} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition w-full md:w-auto shadow-md">{t('manage')}</button>
                         </div>
                     )
                })}
            </div>
        </div>
    );
};

// --- Admin Dashboard ---
export const AdminDashboard = () => {
    const { users, contests, applications, updateUserRole, t } = useApp();
    
    return (
        <div className="space-y-8 animate-fade-in pb-20">
             <h2 className="text-3xl font-bold text-slate-900">{t('adminPanel')}</h2>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-slate-400 text-xs font-bold uppercase mb-2 tracking-wider">{t('users')}</div>
                      <div className="text-4xl font-black text-slate-900">{users.length}</div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-slate-400 text-xs font-bold uppercase mb-2 tracking-wider">Contests</div>
                      <div className="text-4xl font-black text-slate-900">{contests.length}</div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-slate-400 text-xs font-bold uppercase mb-2 tracking-wider">Applications</div>
                      <div className="text-4xl font-black text-blue-600">{applications.length}</div>
                  </div>
             </div>

             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 font-bold text-slate-700">User Management</div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white text-slate-400 text-xs uppercase border-b border-slate-100">
                            <tr><th className="px-6 py-4 font-semibold">Name</th><th className="px-6 py-4 font-semibold">Role</th><th className="px-6 py-4 font-semibold text-right">Actions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{u.name}</div>
                                        <div className="text-xs text-slate-400">{u.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select value={u.role} onChange={e => updateUserRole(u.id, e.target.value)} className="bg-slate-100 border-transparent rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer hover:bg-slate-200">
                                            <option value="participant">Participant</option><option value="organizer">Organizer</option><option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 text-right"><button className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition"><Trash2 className="w-4 h-4"/></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
};

// --- Profile ---
export const Profile = () => {
    const { currentUser, updateUserProfile, t } = useApp();
    const navigate = useNavigate();
    const theme = useThemeClasses();
    const [form, setForm] = useState(currentUser || {} as any);
    const [showPw, setShowPw] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateUserProfile(form);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in pb-20">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-slate-800 transition group mb-6">
                <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition" /> {t('back')}
            </button>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">{t('settings')}</h2>
            <p className="text-slate-500 mb-8">Manage your account settings and preferences.</p>
            
            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 mx-auto mb-6 overflow-hidden relative group cursor-pointer border-4 border-white shadow-lg flex items-center justify-center">
                            {form.avatar ? <img src={form.avatar} className="w-full h-full object-cover"/> : <div className="text-4xl font-bold text-blue-600">{form.name?.[0]}</div>}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-blur-sm"><Camera className="w-8 h-8 text-white"/></div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{form.name}</h3>
                        <div className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t(currentUser?.role as any)}</div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900"><User className="w-5 h-5 text-blue-600"/> Personal Info</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                                 <input required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-2">{t('phone')}</label>
                                     <input className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+7..." />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                                     <input type="email" required className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-slate-700 mb-2">{t('bio')}</label>
                                 <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition h-28 resize-none" value={form.bio || ''} onChange={e => setForm({...form, bio: e.target.value})} placeholder="..." />
                             </div>
                         </div>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-slate-900"><Eye className="w-5 h-5 text-blue-600"/> Security</h3>
                         <div className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="relative">
                                     <label className="block text-sm font-bold text-slate-700 mb-2">{t('newPassword')}</label>
                                     <input type={showPw ? 'text' : 'password'} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
                                 </div>
                                 <div>
                                     <label className="block text-sm font-bold text-slate-700 mb-2">{t('confirmPassword')}</label>
                                     <input type={showPw ? 'text' : 'password'} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="••••••••" />
                                 </div>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer w-fit" onClick={() => setShowPw(!showPw)}>
                                 {showPw ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>} {showPw ? 'Hide' : 'Show'} Password
                             </div>
                         </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition">{t('cancel')}</button>
                        <button type="submit" className={`px-8 py-3 ${theme.buttonPrimary} rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition`}><Save className="w-4 h-4" /> {t('save')}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};