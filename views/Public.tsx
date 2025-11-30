import React, { useState } from 'react';
import { useApp, useThemeClasses } from '../store';
import { useNavigate } from 'react-router-dom';
import { Trophy, User, Briefcase, Shield, Loader2, Calendar, Filter, ChevronLeft, Users, ChevronRight } from 'lucide-react';
import { LazyImage } from '../components/Shared.tsx';
import { getTypeLabel } from '../mockData';
import { ContestType, ContestStatus } from '../types';

export const Login = () => {
    const { login, t, language } = useApp();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const theme = useThemeClasses();

    const handleLogin = async (id: string, path: string) => {
        setIsLoading(true);
        await login(id);
        setIsLoading(false);
        navigate(path);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-4xl w-full rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row relative">
                {isLoading && <div className="absolute inset-0 bg-white/80 z-50 flex items-center justify-center"><Loader2 className={`w-10 h-10 ${theme.text} animate-spin`}/></div>}
                
                <div className={`md:w-1/2 ${theme.bg} p-12 text-white flex flex-col justify-between relative overflow-hidden`}>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 font-bold text-2xl mb-8">
                            <div className="bg-white/20 p-2 rounded-xl backdrop-blur"><Trophy className="w-6 h-6"/></div>
                            {t('appTitle')}
                        </div>
                        <h1 className="text-3xl font-bold mb-4">{t('heroTitle')}</h1>
                        <p className="opacity-90">{t('heroSubtitle')}</p>
                    </div>
                </div>
                
                <div className="md:w-1/2 p-12 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">{t('loginAs')}</h2>
                    <div className="space-y-4">
                        <button onClick={() => handleLogin('u1', '/dashboard')} className={`w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-${theme.bg.split('-')[1]}-500 hover:bg-slate-50 transition text-left group`}>
                            <div className={`w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition`}><User className="w-6 h-6"/></div>
                            <div><div className="font-bold">{t('participant')}</div><div className="text-sm text-slate-500">Student</div></div>
                        </button>
                        <button onClick={() => handleLogin('u2', '/organizer')} className={`w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-${theme.bg.split('-')[1]}-500 hover:bg-slate-50 transition text-left group`}>
                            <div className={`w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition`}><Briefcase className="w-6 h-6"/></div>
                            <div><div className="font-bold">{t('organizer')}</div><div className="text-sm text-slate-500">Teacher</div></div>
                        </button>
                        <button onClick={() => handleLogin('u3', '/admin')} className={`w-full flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-${theme.bg.split('-')[1]}-500 hover:bg-slate-50 transition text-left group`}>
                            <div className={`w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition`}><Shield className="w-6 h-6"/></div>
                            <div><div className="font-bold">{t('admin')}</div><div className="text-sm text-slate-500">Staff</div></div>
                        </button>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-slate-100">
                         <button onClick={() => navigate('/')} className="w-full text-center text-slate-500 font-bold hover:text-blue-600 transition flex items-center justify-center gap-2">
                             {t('continueAsGuest')} <ChevronRight className="w-4 h-4" />
                         </button>
                    </div>

                    <p className="mt-8 text-center text-sm text-slate-400">{t('demoMode')}</p>
                </div>
            </div>
        </div>
    );
};

export const Catalog = () => {
    const { contests, language, t } = useApp();
    const navigate = useNavigate();
    const theme = useThemeClasses();
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getStatusLabel = (status: ContestStatus) => {
        switch(status) {
            case 'open': return { label: t('statusOpen'), color: 'bg-green-100 text-green-700' };
            case 'closed': return { label: t('statusClosed'), color: 'bg-red-100 text-red-700' };
            case 'judging': return { label: t('statusJudging'), color: 'bg-amber-100 text-amber-700' };
            case 'completed': return { label: t('statusCompleted'), color: 'bg-slate-100 text-slate-700' };
        }
    };

    const filtered = contests
        .filter(c => filterType === 'all' || c.type === filterType)
        .filter(c => filterStatus === 'all' || c.status === filterStatus);

    return (
        <div className="space-y-8 animate-fade-in pb-20">
             <div className={`bg-gradient-to-r ${theme.bg.replace('600', '700')} to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden`}>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{t('heroTitle')}</h1>
                    <p className="text-blue-100 text-lg mb-8">{t('heroSubtitle')}</p>
                    <button onClick={() => document.getElementById('grid')?.scrollIntoView({behavior: 'smooth'})} className="bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition shadow-lg">
                        {t('findContest')}
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-40" id="grid">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {['all', 'olympiad', 'hackathon', 'creative', 'sport'].map(type => (
                        <button key={type} onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${filterType === type ? `${theme.bg} text-white shadow-md` : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {type === 'all' ? t('allTypes') : getTypeLabel(type as ContestType, language)}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 w-full md:w-48 cursor-pointer">
                        <option value="all">{t('allStatuses')}</option>
                        <option value="open">{t('statusOpen')}</option>
                        <option value="judging">{t('statusJudging')}</option>
                        <option value="completed">{t('statusCompleted')}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(contest => (
                    <div key={contest.id} onClick={() => navigate(`/contest/${contest.id}`)}
                         className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full">
                        <div className="h-48 relative overflow-hidden">
                            <LazyImage src={contest.image} alt={contest.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-3 left-3"><span className="bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">{getTypeLabel(contest.type, language)}</span></div>
                            <div className="absolute bottom-3 right-3"><span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getStatusLabel(contest.status).color}`}>{getStatusLabel(contest.status).label}</span></div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="text-xs text-slate-400 mb-2 flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(contest.endDate).toLocaleDateString()}</div>
                            <h3 className={`text-xl font-bold text-slate-900 mb-2 ${theme.textHover} transition-colors line-clamp-2`}>{contest.title}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">{contest.description}</p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className={`font-medium text-sm flex items-center ${theme.text}`}>{t('description')} <ChevronLeft className="w-4 h-4 rotate-180 ml-1"/></span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filtered.length === 0 && <div className="text-center py-20 text-slate-400">{t('noContests')}</div>}
        </div>
    );
};