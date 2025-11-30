import React, { useState, useRef, useEffect } from 'react';
import { useApp, useThemeClasses } from '../store';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
    Trophy, User, LogOut, Settings, Bell, X, CheckCircle, AlertCircle, 
    HelpCircle, MessageCircle, FileText, Briefcase, Paperclip, Loader2,
    Eye, ChevronDown, Accessibility, Moon, Sun, Image as ImageIcon, ImageOff, Type,
    Clock, ChevronLeft, RotateCcw
} from 'lucide-react';
import { UserRole, ApplicationStatus } from '../types';

// --- Toast Container ---
export const ToastContainer = () => {
    const { toasts, removeToast } = useApp();
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
            {toasts.map(toast => (
                <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl border animate-fade-in ${
                    toast.type === 'success' ? 'bg-white border-green-200 text-green-800' :
                    toast.type === 'error' ? 'bg-white border-red-200 text-red-800' :
                    'bg-slate-800 border-slate-700 text-white'
                }`}>
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                    {toast.type === 'info' && <Bell className="w-5 h-5 text-blue-400" />}
                    <p className="text-sm font-medium flex-1">{toast.message}</p>
                    <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100"><X className="w-4 h-4" /></button>
                </div>
            ))}
        </div>
    );
};

// --- Status Badge ---
export const StatusBadge = ({ status, className }: { status: ApplicationStatus; className?: string }) => {
    const { t } = useApp();
    
    const getConfig = (s: ApplicationStatus) => {
        switch(s) {
            case 'winner': return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Trophy };
            case 'approved': return { color: 'text-green-700 bg-green-50 border-green-200', icon: CheckCircle };
            case 'rejected': return { color: 'text-red-700 bg-red-50 border-red-200', icon: X };
            case 'participant': return { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: User };
            case 'pending': return { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: Clock };
            default: return { color: 'text-slate-600 bg-slate-50 border-slate-200', icon: User };
        }
    };

    const config = getConfig(status);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-sm ${config.color} ${className}`}>
            <Icon className="w-3.5 h-3.5" />
            {t(status)}
        </span>
    );
};

// --- Lazy Image ---
export const LazyImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
            {!loaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
            <img 
                src={src} alt={alt} loading="lazy" onLoad={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            />
        </div>
    );
};

// --- Accessibility Panel ---
export const AccessibilityPanel = () => {
    const { settings, setSettings, t } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const theme = useThemeClasses();
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const reset = () => setSettings({
        color: 'blue',
        fontSize: 16,
        highContrast: false,
        hideImages: false,
        darkMode: false
    });

    return (
        <div className="relative" ref={panelRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition" title={t('settings')}>
                <Accessibility className="w-5 h-5" />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-scale-in">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-800">{t('settings')}</span>
                        <button onClick={() => setIsOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">{t('theme')}</div>
                            <div className="flex gap-2">
                                {(['blue', 'green', 'purple', 'orange'] as const).map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setSettings({ ...settings, color: c })}
                                        className={`w-8 h-8 rounded-full border-2 ${settings.color === c ? 'border-slate-800 scale-110' : 'border-transparent'} bg-${c}-600 transition`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">{t('fontSize')}</div>
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                <button onClick={() => setSettings({...settings, fontSize: 14})} className={`flex-1 py-1 rounded-md text-sm ${settings.fontSize === 14 ? 'bg-white shadow' : ''}`}>A-</button>
                                <button onClick={() => setSettings({...settings, fontSize: 16})} className={`flex-1 py-1 rounded-md text-base ${settings.fontSize === 16 ? 'bg-white shadow' : ''}`}>A</button>
                                <button onClick={() => setSettings({...settings, fontSize: 20})} className={`flex-1 py-1 rounded-md text-lg ${settings.fontSize === 20 ? 'bg-white shadow' : ''}`}>A+</button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button 
                                onClick={() => setSettings({...settings, highContrast: !settings.highContrast})}
                                className={`w-full flex items-center justify-between p-2 rounded-lg border ${settings.highContrast ? theme.border + ' ' + theme.lightBg : 'border-slate-200'}`}
                            >
                                <span className="flex items-center gap-2 text-sm"><Eye className="w-4 h-4" /> {t('highContrast')}</span>
                                {settings.highContrast && <CheckCircle className={`w-4 h-4 ${theme.text}`} />}
                            </button>
                            
                            <button 
                                onClick={() => setSettings({...settings, hideImages: !settings.hideImages})}
                                className={`w-full flex items-center justify-between p-2 rounded-lg border ${settings.hideImages ? theme.border + ' ' + theme.lightBg : 'border-slate-200'}`}
                            >
                                <span className="flex items-center gap-2 text-sm"><ImageOff className="w-4 h-4" /> {t('hideImages')}</span>
                                {settings.hideImages && <CheckCircle className={`w-4 h-4 ${theme.text}`} />}
                            </button>
                        </div>
                        
                        <button onClick={reset} className="w-full py-2 mt-4 text-sm text-slate-500 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 transition border border-dashed border-slate-300 hover:border-slate-400">
                            <RotateCcw className="w-3.5 h-3.5" /> {t('resetSettings')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Navbar ---
export const Navbar = () => {
    const { currentUser, logout, isLoggedIn, language, setLanguage, t } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const theme = useThemeClasses();
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2.5 font-bold text-2xl tracking-tight text-slate-900 group">
                    <div className={`${theme.bg} text-white p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition duration-300`}>
                        <Trophy className="w-5 h-5" strokeWidth={3} />
                    </div>
                    {t('appTitle')}
                </Link>

                {isLoggedIn && (
                    <div className="hidden md:flex items-center bg-slate-100/50 p-1.5 rounded-xl gap-1 mx-4">
                        <Link to="/" className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive('/') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                            {t('catalog')}
                        </Link>
                        {currentUser?.role === 'participant' && (
                            <Link to="/dashboard" className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                                {t('myApps')}
                            </Link>
                        )}
                        {currentUser?.role === 'organizer' && (
                            <Link to="/organizer" className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive('/organizer') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                                {t('organizer')}
                            </Link>
                        )}
                        {currentUser?.role === 'admin' && (
                            <Link to="/admin" className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${isActive('/admin') ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                                {t('admin')}
                            </Link>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                        className="font-bold text-sm text-slate-500 hover:text-slate-800 uppercase"
                    >
                        {language}
                    </button>

                    <AccessibilityPanel />

                    {isLoggedIn && currentUser ? (
                        <div className="relative" ref={menuRef}>
                            <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 group">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-bold text-slate-900 leading-none mb-1">{currentUser.name}</div>
                                    <div className="text-xs font-medium text-slate-500 uppercase">{t(currentUser.role as any)}</div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-4 ring-slate-50 group-hover:ring-slate-100 transition shadow-sm">
                                     {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover"/> : currentUser.name[0]}
                                </div>
                            </button>
                            
                            {menuOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-scale-in">
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition rounded-t-xl">
                                        <Settings className="w-4 h-4"/> {t('profile')}
                                    </Link>
                                    <div className="h-px bg-slate-100"></div>
                                    <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition rounded-b-xl">
                                        <LogOut className="w-4 h-4"/> {t('logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className={`${theme.bg} text-white px-5 py-2 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition duration-200`}>
                            {t('login')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

// --- Support Widget ---
export const SupportWidget = () => {
    const { addToast, t } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'menu'|'form'|'success'>('menu');
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const theme = useThemeClasses();

    const toggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setView('menu');
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFileName(e.target.files[0].name);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsLoading(false);
        setView('success');
        setFileName(null);
        addToast({ type: 'success', message: t('messageSent') });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            {isOpen && (
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-80 sm:w-96 overflow-hidden animate-slide-up origin-bottom-right flex flex-col">
                    <div className={`${theme.bg} p-4 text-white flex justify-between items-center`}>
                        <h3 className="font-bold flex items-center gap-2"><HelpCircle className="w-5 h-5"/> {t('support')}</h3>
                        <button onClick={toggle} className="hover:bg-white/20 p-1 rounded-full transition"><X className="w-4 h-4"/></button>
                    </div>
                    
                    <div className="p-5">
                        {view === 'menu' && (
                             <div className="space-y-3 animate-fade-in">
                                <p className="text-sm text-slate-500 mb-4">{t('howCanWeHelp')}</p>
                                {[
                                    { icon: MessageCircle, label: t('writeMessage'), action: () => setView('form') },
                                    { icon: FileText, label: t('faq'), action: () => {} },
                                    { icon: Briefcase, label: t('organizer'), action: () => {} }
                                ].map((item, idx) => (
                                    <button key={idx} onClick={item.action} className={`w-full text-left p-3 rounded-xl bg-slate-50 hover:${theme.lightBg} hover:${theme.text} transition flex items-center gap-3 font-medium text-slate-700 text-sm border border-slate-100 group`}>
                                        <div className="p-2 bg-white rounded-lg group-hover:bg-white/50 transition shadow-sm"><item.icon className="w-4 h-4"/></div>
                                        {item.label}
                                    </button>
                                ))}
                             </div>
                        )}

                        {view === 'form' && (
                            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                                <button type="button" onClick={() => setView('menu')} className="text-xs text-slate-400 hover:text-slate-600 flex items-center mb-2">
                                    <ChevronLeft className="w-3 h-3 mr-1"/> {t('back')}
                                </button>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">{t('topic')}</label>
                                    <select className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition">
                                        <option>{t('techIssue')}</option>
                                        <option>{t('contestQuestion')}</option>
                                        <option>{t('other')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase mb-1 block">{t('message')}</label>
                                    <textarea required className="w-full p-3 rounded-lg border border-slate-200 text-sm bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] transition resize-none" placeholder="..." />
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <input type="file" id="f" className="hidden" onChange={handleFile} />
                                    <label htmlFor="f" className={`text-xs flex items-center gap-1.5 text-slate-500 hover:${theme.text} cursor-pointer font-medium p-2 hover:bg-slate-50 rounded-lg transition border border-transparent hover:border-slate-200`}>
                                        <Paperclip className="w-3.5 h-3.5"/> 
                                        {fileName ? <span className={`${theme.text} truncate max-w-[150px]`}>{fileName}</span> : t('attachFile')}
                                    </label>
                                    {fileName && <button type="button" onClick={() => setFileName(null)}><X className="w-3 h-3 text-red-400"/></button>}
                                </div>

                                <button disabled={isLoading} className={`w-full py-2.5 ${theme.bg} text-white rounded-lg font-bold text-sm hover:brightness-110 transition flex justify-center items-center shadow-lg shadow-blue-200 disabled:opacity-70`}>
                                    {isLoading ? <Loader2 className="animate-spin w-4 h-4"/> : t('send')}
                                </button>
                            </form>
                        )}

                        {view === 'success' && (
                           <div className="text-center py-6 animate-scale-in">
                              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                 <CheckCircle className="w-6 h-6"/>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-1">{t('messageSent')}</h4>
                              <p className="text-xs text-slate-500 mb-4">{t('messageSentDesc')}</p>
                              <button onClick={toggle} className={`text-sm ${theme.text} font-bold hover:underline`}>{t('close')}</button>
                           </div>
                        )}
                    </div>
                </div>
            )}
            
            <button 
                onClick={toggle}
                className={`h-14 w-14 rounded-full ${theme.bg} text-white shadow-lg flex items-center justify-center hover:scale-110 hover:shadow-xl transition duration-300`}
            >
                {isOpen ? <X className="w-6 h-6"/> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};