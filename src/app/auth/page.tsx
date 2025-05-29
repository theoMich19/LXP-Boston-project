"use client"
import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { Alert } from '@/components/ui/alert';
import { LoginForm } from '@/domains/auth/form/login';
import { RegisterForm } from '@/domains/auth/form/register';
import { loginSchema, registerSchema } from '@/domains/auth/schema/register';
import { AuthPageProps, LoginFormData, RegisterSubmitData } from '@/types/auth';


const AuthPage: React.FC<AuthPageProps> = ({ initialView = 'login' }) => {
    const [currentView, setCurrentView] = useState<'login' | 'register'>(initialView);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    } | null>(null);

    // Simulation d'appel API pour le login
    const handleLogin = useCallback(async (formData: LoginFormData) => {
        setIsLoading(true);
        setAlert(null);

        try {
            // Validation supplémentaire côté client
            const validatedData = loginSchema.parse(formData);

            // Simuler un appel API
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Ici vous ajouterez votre vraie logique d'authentification
            console.log('Login data:', validatedData);

            // Simuler différents scénarios
            if (validatedData.email === 'test@error.com') {
                throw new Error('Email ou mot de passe incorrect');
            }

            setAlert({
                type: 'success',
                message: 'Connexion réussie ! Redirection en cours...'
            });

            // Redirection après succès
            setTimeout(() => {
                // window.location.href = '/dashboard';
                console.log('Redirect to dashboard');
            }, 1500);

        } catch (error) {
            if (error instanceof z.ZodError) {
                setAlert({
                    type: 'error',
                    message: 'Données invalides. Veuillez vérifier vos informations.'
                });
            } else {
                setAlert({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Erreur de connexion. Vérifiez vos identifiants.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, []);


    const switchToRegister = useCallback(() => {
        setCurrentView('register');
        setAlert(null);
    }, []);

    const switchToLogin = useCallback(() => {
        setCurrentView('login');
        setAlert(null);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {alert && (
                    <div className="mb-6">
                        <Alert
                            title={
                                alert.type === 'success' ? 'Succès' :
                                    alert.type === 'error' ? 'Erreur' :
                                        alert.type === 'warning' ? 'Attention' : 'Information'
                            }
                            className={`${alert.type === 'success' ? 'border-success bg-success/10' :
                                alert.type === 'error' ? 'border-destructive bg-destructive/10' :
                                    alert.type === 'warning' ? 'border-warning bg-warning/10' :
                                        'border-primary bg-primary/10'
                                } animate-slide-up`}
                        >
                            {alert.message}
                        </Alert>
                    </div>
                )}

                {currentView === 'login' ? (
                    <LoginForm
                        onSwitchToRegister={switchToRegister}
                        isLoading={isLoading}
                        onSubmit={handleLogin}
                    />
                ) : (
                    <RegisterForm
                        onSwitchToLogin={switchToLogin}
                    />
                )}

                <div className="text-center mt-8">
                    <p className="text-xs text-muted-foreground">
                        © 2025 TalentBridge. Tous droits réservés.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
