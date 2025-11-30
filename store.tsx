import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
    UserData, Contest, Application, Toast, ThemeSettings, ThemeColor, Language,
    ApplicationStatus
} from './types';
import { INITIAL_USERS, INITIAL_CONTESTS, INITIAL_APPLICATIONS, TRANSLATIONS } from './mockData';

// --- Types ---
interface AppState {
    users: UserData[];
    contests: Contest[];
    applications: Application[];
    currentUser: UserData | null;
    isLoggedIn: boolean;
    toasts: Toast[];
    settings: ThemeSettings;
    language: Language;
}

interface AppContextType extends AppState {
    login: (userId: string) => Promise<void>;
    logout: () => void;
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
    setSettings: (settings: ThemeSettings) => void;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof TRANSLATIONS['ru']) => string;
    // Data Actions
    createContest: (contest: Partial<Contest>) => Promise<void>;
    applyForContest: (contestId: string, name: string, group: string, email: string) => Promise<void>;
    updateApplicationStatus: (appId: string, status: ApplicationStatus) => void;
    updateApplicationScore: (appId: string, score: number) => void;
    publishResults: (contestId: string) => Promise<void>;
    updateUserRole: (userId: string, role: any) => void;
    updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Provider ---

export const AppProvider = ({ children }: { children?: ReactNode }) => {
    // Data State
    const [users, setUsers] = useState<UserData[]>(INITIAL_USERS);
    const [contests, setContests] = useState<Contest[]>(INITIAL_CONTESTS);
    const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);
    
    // UI State
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('app_lang') as Language) || 'ru';
    });

    const [settings, setSettingsState] = useState<ThemeSettings>(() => {
        const saved = localStorage.getItem('app_settings');
        return saved ? JSON.parse(saved) : {
            color: 'blue',
            fontSize: 16,
            highContrast: false,
            hideImages: false,
            darkMode: false
        };
    });

    // --- Effects ---

    useEffect(() => {
        localStorage.setItem('app_lang', language);
    }, [language]);

    useEffect(() => {
        localStorage.setItem('app_settings', JSON.stringify(settings));
        
        // Apply Settings
        const root = document.documentElement;
        
        // Font Size
        root.style.fontSize = `${settings.fontSize}px`;
        
        // High Contrast
        if (settings.highContrast) document.body.classList.add('high-contrast');
        else document.body.classList.remove('high-contrast');

        // Hide Images
        if (settings.hideImages) document.body.classList.add('hide-images');
        else document.body.classList.remove('hide-images');

        // Dark Mode
        if (settings.darkMode) root.classList.add('dark');
        else root.classList.remove('dark');

    }, [settings]);

    // --- Actions ---

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { ...toast, id }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
    }, []);

    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const setSettings = (newSettings: ThemeSettings) => setSettingsState(newSettings);
    const setLanguage = (lang: Language) => setLanguageState(lang);

    const fakeDelay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

    const login = async (userId: string) => {
        await fakeDelay();
        const user = users.find(u => u.id === userId);
        if (user) {
            setCurrentUser(user);
            addToast({ type: 'success', message: `${t('welcome')}, ${user.name}!` });
        }
    };

    const logout = () => {
        setCurrentUser(null);
        addToast({ type: 'info', message: TRANSLATIONS[language].logout });
    };

    const createContest = async (data: Partial<Contest>) => {
        await fakeDelay();
        if (!currentUser) return;
        const newContest: Contest = {
            ...data as Contest,
            id: Date.now().toString(),
            organizerId: currentUser.id,
            organizerName: currentUser.group || currentUser.name,
            image: `https://picsum.photos/800/600?random=${Date.now()}`,
            resultsPublished: false,
            files: [{ name: 'Task.pdf', size: '1.2 MB' }]
        };
        setContests(prev => [newContest, ...prev]);
        addToast({ type: 'success', message: 'Contest created successfully' });
    };

    const applyForContest = async (contestId: string, name: string, group: string, email: string) => {
        await fakeDelay();
        if (!currentUser) return;
        const newApp: Application = {
            id: Date.now().toString(),
            contestId,
            userId: currentUser.id,
            applicantName: name,
            group,
            email,
            status: 'pending',
            submissionDate: new Date().toISOString().split('T')[0]
        };
        setApplications(prev => [...prev, newApp]);
        addToast({ type: 'success', message: 'Application submitted!' });
    };

    const updateApplicationStatus = (appId: string, status: ApplicationStatus) => {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        addToast({ type: 'success', message: 'Status updated' });
    };

    const updateApplicationScore = (appId: string, score: number) => {
        setApplications(prev => prev.map(a => a.id === appId ? { ...a, score } : a));
    };

    const publishResults = async (contestId: string) => {
        await fakeDelay();
        setContests(prev => prev.map(c => c.id === contestId ? { ...c, resultsPublished: true, status: 'completed' } : c));
        addToast({ type: 'success', message: t('publishResults') });
    };

    const updateUserRole = (userId: string, role: any) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    };
    
    const updateUserProfile = async (data: Partial<UserData>) => {
        await fakeDelay();
        if(!currentUser) return;
        const updated = { ...currentUser, ...data };
        setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
        setCurrentUser(updated);
        addToast({ type: 'success', message: t('save') });
    }

    const t = (key: keyof typeof TRANSLATIONS['ru']) => {
        return TRANSLATIONS[language][key] || key;
    };

    return (
        <AppContext.Provider value={{
            users, contests, applications, currentUser, isLoggedIn: !!currentUser, toasts, settings, language,
            login, logout, addToast, removeToast, setSettings, setLanguage, t,
            createContest, applyForContest, updateApplicationStatus, updateApplicationScore, publishResults, updateUserRole, updateUserProfile
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};

// Helper hook for theme colors
export const useThemeClasses = () => {
    const { settings } = useApp();
    const c = settings.color;
    return {
        bg: `bg-${c}-600`,
        bgHover: `hover:bg-${c}-700`,
        text: `text-${c}-600`,
        textHover: `hover:text-${c}-700`,
        border: `border-${c}-200`,
        lightBg: `bg-${c}-50`,
        focusRing: `focus:ring-${c}-500`,
        buttonPrimary: `bg-${c}-600 text-white hover:bg-${c}-700 shadow-${c}-200`,
        badge: `bg-${c}-100 text-${c}-700`
    };
};