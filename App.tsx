import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { Navbar, ToastContainer, SupportWidget } from './components/Shared.tsx';
import { Login, Catalog } from './views/Public.tsx';
import { 
    ContestDetails, UserDashboard, OrganizerDashboard, 
    AdminDashboard, Profile 
} from './views/Private.tsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children?: React.ReactNode, allowedRoles?: string[] }) => {
    const { isLoggedIn, currentUser } = useApp();
    
    if (!isLoggedIn || !currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const AppContent = () => {
    return (
        <HashRouter>
            <div className="min-h-screen bg-slate-50/50 font-sans">
                <ToastContainer />
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                    <Routes>
                        <Route path="/" element={<Catalog />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/contest/:id" element={<ContestDetails />} />
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['participant']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/organizer" element={
                            <ProtectedRoute allowedRoles={['organizer']}>
                                <OrganizerDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <SupportWidget />
            </div>
        </HashRouter>
    );
};

const App = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;