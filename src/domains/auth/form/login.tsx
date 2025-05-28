import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useZodValidation } from '@/hooks/useZodValidationAuth';
import { LoginFormProps, LoginFormData } from '@/types/auth';
import { loginSchema } from '../schema/schema';


export const LoginForm: React.FC<LoginFormProps> = ({
    onSwitchToRegister,
    isLoading,
    onSubmit,
    className = ""
}) => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    // Utilisation du hook de validation Zod
    const {
        errors,
        isValidating,
        validateField,
        validateAll,
        clearFieldError,
        isValid
    } = useZodValidation(loginSchema, formData);

    // Gestion des changements d'input
    const handleInputChange = useCallback((field: keyof LoginFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        clearFieldError(field);

        // Validation différée pour l'email
        if (field === 'email' && value.includes('@')) {
            setTimeout(() => validateField(field), 500);
        }
    }, [clearFieldError, validateField]);

    // Toggle du mot de passe
    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    // Toggle remember me
    const toggleRememberMe = useCallback(() => {
        setRememberMe(prev => !prev);
    }, []);

    // Soumission du formulaire
    const handleSubmit = useCallback(async () => {
        await validateAll();

        if (isValid) {
            try {
                await onSubmit({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password
                });
            } catch (error) {
                console.error('Erreur lors de la soumission:', error);
            }
        }
    }, [formData, onSubmit, validateAll, isValid]);

    // Gestion des touches clavier
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

                <div className="flex items-center justify-between">
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
                </div>

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

            {isDirty && (
                <div className="mt-4 text-center">
                    <div className={`inline-flex items-center px-3 py-2 rounded-full text-xs transition-all ${isValid
                        ? 'bg-success/10 text-success border border-success/20'
                        : 'bg-muted text-muted-foreground'
                        }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${isValid ? 'bg-success' : 'bg-muted-foreground'
                            }`} />
                        {isValid ? 'Formulaire valide' : 'Veuillez remplir tous les champs correctement'}
                    </div>
                </div>
            )}
        </Card>
    );
};
