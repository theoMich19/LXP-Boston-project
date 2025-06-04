import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useZodValidation } from '@/hooks/useZodValidationAuth';
import { LoginFormProps, LoginFormData } from '@/types/auth';
import { loginSchema } from '../schema/login';
import { loginUser } from '../server/login';
import toastUtils from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/userContext';


export const LoginForm: React.FC<LoginFormProps> = ({
    onSwitchToRegister,
    className = ""
}) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const { login } = useUser();
    const route = useRouter()
    const {
        errors,
        isValidating,
        validateField,
        validateAll,
        clearFieldError,
        isValid
    } = useZodValidation(loginSchema, formData);

    const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearFieldError(field);

        if (field === 'email' && value.includes('@')) {
            setTimeout(() => validateField(field), 500);
        }
    }, [clearFieldError, validateField]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const toggleRememberMe = useCallback(() => {
        setRememberMe(prev => !prev);
    }, []);

    const handleSubmit = useCallback(async () => {
        await validateAll();

        if (isValid) {
            setIsLoading(true);

            try {
                const apiData = {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                };

                const result = await loginUser(apiData);


                if (result.access_token && result.user) {
                    login(result.user, result.access_token);
                }

                if (rememberMe) {
                    localStorage.setItem('remember_me', 'true');
                }
                toastUtils.info("Connexion réussie")
                route.push('/dashboard')


            } catch (error) {
                console.error('Erreur lors de la connexion:', error);

                let errorMessage = error.message || 'Une erreur est survenue';

                if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                    errorMessage = 'Email ou mot de passe incorrect';
                } else if (error.message.includes('429')) {
                    errorMessage = 'Trop de tentatives. Veuillez réessayer plus tard';
                } else if (error.message.includes('500')) {
                    errorMessage = 'Erreur serveur. Veuillez réessayer plus tard';
                }

                toastUtils.error(errorMessage)
                // setApiError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }
    }, [formData, validateAll, isValid, rememberMe]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !isLoading) {
            event.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit, isLoading]);

    return (
        <Card className={`w-full max-w-md p-8 glass-effect ${className}`}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Se connecter
                </h2>
                <p className="text-muted-foreground">
                    Connectez-vous à votre compte TalentBridge
                </p>
            </div>

            <div className="space-y-6" onKeyDown={handleKeyDown}>
                <div className="space-y-2">
                    <label
                        htmlFor="login-email"
                        className="text-sm font-medium text-foreground"
                    >
                        Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Mail
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                            aria-hidden="true"
                        />
                        <Input
                            id="login-email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className={`pl-10 transition-colors ${errors.email
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={isLoading}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "login-email-error" : undefined}
                        />
                    </div>
                    {errors.email && (
                        <p
                            id="login-email-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="login-password"
                        className="text-sm font-medium text-foreground"
                    >
                        Mot de passe <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                            aria-hidden="true"
                        />
                        <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className={`pl-10 pr-12 transition-colors ${errors.password
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={isLoading}
                            autoComplete="current-password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "login-password-error" : undefined}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            disabled={isLoading}
                            aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                            {showPassword ?
                                <EyeOff className="h-5 w-5" aria-hidden="true" /> :
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            }
                        </button>
                    </div>
                    {errors.password && (
                        <p
                            id="login-password-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={toggleRememberMe}
                            className="rounded border-border text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
                            disabled={isLoading}
                        />
                        <span className="text-muted-foreground select-none">
                            Se souvenir de moi
                        </span>
                    </label>
                    <button
                        type="button"
                        className="text-sm text-primary hover:underline focus:outline-none focus:underline transition-all"
                        disabled={isLoading}
                        onClick={() => console.log('Mot de passe oublié')}
                    >
                        Mot de passe oublié ?
                    </button>
                </div> */}

                <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading || !isValid || isValidating}
                    size="lg"
                >
                    {isLoading ? (
                        <div className="flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Connexion...</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <span>Se connecter</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    )}
                </Button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                    Pas encore de compte ?{' '}
                    <button
                        onClick={onSwitchToRegister}
                        className="text-primary hover:underline font-medium focus:outline-none focus:underline transition-all"
                        disabled={isLoading}
                    >
                        Créer un compte
                    </button>
                </p>
            </div>

        </Card>
    );
};
