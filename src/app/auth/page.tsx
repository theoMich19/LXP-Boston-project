"use client"

import React, { useState, useCallback } from 'react';
import { LoginForm } from '@/domains/auth/form/login';
import { RegisterForm } from '@/domains/auth/form/register';
import { AuthPageProps } from '@/types/auth';


const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'login' }) => {
    const [currentView, setCurrentView] = useState<'login' | 'register'>(initialView);

    const switchToRegister = useCallback(() => {
        setCurrentView('register');
    }, []);

    const switchToLogin = useCallback(() => {
        setCurrentView('login');
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5 flex h-max-screen items-center justify-center">
            <div className="w-full max-w-md">
                {currentView === 'login' ? (
                    <LoginForm onSwitchToRegister={switchToRegister} />
                ) : (
                    <RegisterForm onSwitchToLogin={switchToLogin} />
                )}
            </div>
        </div>
    );
};

export default AuthPage;
