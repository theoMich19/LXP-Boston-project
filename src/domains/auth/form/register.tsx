"use client"
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useZodValidation } from "@/hooks/useZodValidationAuth";
import { RegisterFormProps, RegisterFormData, RegisterSubmitData } from "@/types/auth";
import { User, Mail, EyeOff, Eye, Check, X, Loader2, Shield, ArrowRight, Lock, UserCheck, Building } from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { registerSchema } from "../schema/register";
import { getPasswordStrength } from "@/utils/auth";
import { Input } from "@/components/ui/input";
import { registerUser } from "@/domains/auth/server/register";
import { CompaniesResponse, Company } from "@/types/company";

const ROLES = [
    {
        value: 'candidate',
        label: 'Candidate',
        description: 'I\'m looking for a job',
        icon: UserCheck
    },
    {
        value: 'hr',
        label: 'Recruiter',
        description: 'I recruit talents',
        icon: Building
    }
] as const;

export const RegisterForm: React.FC<RegisterFormProps> = ({
    onSwitchToLogin,
    className = ""
}) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: '',
        company_id: null
    });
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoadingCompanies, setIsLoadingCompanies] = useState<boolean>(false);

    const {
        errors,
        isValidating,
        validateField,
        validateAll,
        clearFieldError,
        isValid
    } = useZodValidation(registerSchema, formData);

    const fetchCompanies = useCallback(async () => {
        setIsLoadingCompanies(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/companies/`);
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            const data: CompaniesResponse = await response.json();
            setCompanies(data.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setIsLoadingCompanies(false);
        }
    }, []);

    useEffect(() => {
        if (formData.role === 'hr' && companies.length === 0) {
            fetchCompanies();
        }
    }, [formData.role, fetchCompanies, companies.length]);

    const handleInputChange = useCallback((field: keyof RegisterFormData, value: string | boolean | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearFieldError(field);

        if (typeof value === 'string' && value.length > 0) {
            if (field === 'email' && value.includes('@')) {
                setTimeout(() => validateField(field), 500);
            }
            if ((field === 'firstName' || field === 'lastName') && value.length >= 2) {
                setTimeout(() => validateField(field), 300);
            }
        }
    }, [clearFieldError, validateField, formData.password]);

    const handleRoleChange = useCallback((role: 'candidate' | 'hr') => {
        setFormData(prev => ({ ...prev, role }));
        clearFieldError('role');
    }, [clearFieldError]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);

    const handleFocus = useCallback((field: string) => {
        setFocusedField(field);
    }, []);

    const handleBlur = useCallback(() => {
        setFocusedField(null);
    }, []);

    const handleSubmit = useCallback(async () => {
        await validateAll();

        if (isValid) {
            setIsLoading(true);

            try {
                const { ...submitData } = formData;
                const apiData: RegisterSubmitData = {
                    email: submitData.email.trim().toLowerCase(),
                    first_name: submitData.firstName.trim(),
                    last_name: submitData.lastName.trim(),
                    password: submitData.password,
                    role: submitData.role,
                    company_id: formData.role === 'hr' ? formData.company_id : null
                };

                const result = await registerUser(apiData);

                if (result.token) {
                    localStorage.setItem('auth_token', result.token);
                }

                onSwitchToLogin()

            } catch (error) {
                console.error('Registration error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [formData, validateAll, isValid]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter' && !isLoading) {
            event.preventDefault();
            handleSubmit();
        }
    }, [handleSubmit, isLoading]);

    const passwordStrength = useMemo(() =>
        getPasswordStrength(formData.password), [formData.password]
    );
    return (
        <Card className={`w-full max-w-md p-8 glass-effect ${className}`}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                    Create Account
                </h2>
                <p className="text-muted-foreground">
                    Join TalentBridge and find your ideal {formData.role === 'candidate' ? 'job' : 'talents'}
                </p>
            </div>

            <div className="space-y-6" onKeyDown={handleKeyDown}>
                {/* Role selection */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                        I am <span className="text-destructive">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((role) => {
                            const IconComponent = role.icon;
                            const isSelected = formData.role === role.value;

                            return (
                                <button
                                    key={role.value}
                                    type="button"
                                    onClick={() => handleRoleChange(role.value)}
                                    className={`
                                        relative p-4 border-2 rounded-lg transition-all duration-200 
                                        hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                                        ${isSelected
                                            ? 'border-primary bg-primary/5 shadow-sm'
                                            : 'border-border hover:border-primary/50'
                                        }
                                    `}
                                    disabled={isLoading}
                                    aria-pressed={isSelected}
                                    aria-describedby={`role-${role.value}-desc`}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <IconComponent
                                            className={`h-6 w-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'
                                                }`}
                                        />
                                        <div className="text-center">
                                            <p className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-foreground'
                                                }`}>
                                                {role.label}
                                            </p>
                                            <p
                                                id={`role-${role.value}-desc`}
                                                className="text-xs text-muted-foreground mt-1"
                                            >
                                                {role.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Selection indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    {errors.role && (
                        <p className="text-sm text-destructive animate-slide-up" role="alert">
                            {errors.role}
                        </p>
                    )}
                </div>

                {/* Company selection for HR */}
                {formData.role === 'hr' && (
                    <div className="space-y-2">
                        <label
                            htmlFor="register-company"
                            className="text-sm font-medium text-foreground"
                        >
                            Select your company <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <Building
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                                aria-hidden="true"
                            />
                            <select
                                id="register-company"
                                value={formData.company_id}
                                onChange={(e) => handleInputChange('company_id', Number(e.target.value))}
                                className={`
                                    w-full pl-10 pr-4 py-3 border rounded-md bg-background text-foreground
                                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
                                    transition-colors appearance-none
                                    ${errors.companyId
                                        ? 'border-destructive focus:border-destructive focus:ring-destructive'
                                        : 'border-input'
                                    }
                                    ${isLoadingCompanies ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                                disabled={isLoading || isLoadingCompanies}
                                aria-invalid={!!errors.companyId}
                                aria-describedby={errors.companyId ? "register-company-error" : undefined}
                            >
                                <option value="">
                                    {isLoadingCompanies ? 'Loading companies...' : 'Choose a company'}
                                </option>
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name} - {company.city}
                                    </option>
                                ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                {isLoadingCompanies ? (
                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        {errors.companyId && (
                            <p
                                id="register-company-error"
                                className="text-sm text-destructive animate-slide-up"
                                role="alert"
                            >
                                {errors.companyId}
                            </p>
                        )}
                    </div>
                )}

                {/* First name and last name fields */}
                <div className="flex flex-row sm:flex-col gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="register-firstName"
                            className="text-sm font-medium text-foreground"
                        >
                            First Name <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                                aria-hidden="true"
                            />
                            <Input
                                id="register-firstName"
                                type="text"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                onFocus={() => handleFocus('firstName')}
                                onBlur={handleBlur}
                                className={`pl-10 transition-colors ${errors.firstName
                                    ? 'border-destructive focus:border-destructive'
                                    : 'focus:border-primary'
                                    }`}
                                disabled={isLoading}
                                autoComplete="given-name"
                                aria-invalid={!!errors.firstName}
                                aria-describedby={errors.firstName ? "register-firstName-error" : undefined}
                            />
                        </div>
                        {errors.firstName && (
                            <p
                                id="register-firstName-error"
                                className="text-sm text-destructive animate-slide-up"
                                role="alert"
                            >
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="register-lastName"
                            className="text-sm font-medium text-foreground"
                        >
                            Last Name <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <User
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                                aria-hidden="true"
                            />
                            <Input
                                id="register-lastName"
                                type="text"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                onFocus={() => handleFocus('lastName')}
                                onBlur={handleBlur}
                                className={`pl-10 transition-colors ${errors.lastName
                                    ? 'border-destructive focus:border-destructive'
                                    : 'focus:border-primary'
                                    }`}
                                disabled={isLoading}
                                autoComplete="family-name"
                                aria-invalid={!!errors.lastName}
                                aria-describedby={errors.lastName ? "register-lastName-error" : undefined}
                            />
                        </div>
                        {errors.lastName && (
                            <p
                                id="register-lastName-error"
                                className="text-sm text-destructive animate-slide-up"
                                role="alert"
                            >
                                {errors.lastName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label
                        htmlFor="register-email"
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
                            id="register-email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onFocus={() => handleFocus('email')}
                            onBlur={handleBlur}
                            className={`pl-10 transition-colors ${errors.email
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={isLoading}
                            autoComplete="email"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "register-email-error" : undefined}
                        />
                    </div>
                    {errors.email && (
                        <p
                            id="register-email-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label
                        htmlFor="register-password"
                        className="text-sm font-medium text-foreground"
                    >
                        Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Lock
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none"
                            aria-hidden="true"
                        />
                        <Input
                            id="register-password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            onFocus={() => handleFocus('password')}
                            onBlur={handleBlur}
                            className={`pl-10 pr-12 transition-colors ${errors.password
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={isLoading}
                            autoComplete="new-password"
                            aria-invalid={!!errors.password}
                            aria-describedby={errors.password ? "register-password-error" : "password-strength"}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                            disabled={isLoading}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ?
                                <EyeOff className="h-5 w-5" aria-hidden="true" /> :
                                <Eye className="h-5 w-5" aria-hidden="true" />
                            }
                        </button>
                    </div>

                    {formData.password && (
                        <div id="password-strength" className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                                        style={{ width: `${passwordStrength.strength}%` }}
                                    />
                                </div>
                                <span className={`text-xs font-medium ${passwordStrength.strength >= 80 ? 'text-success' :
                                    passwordStrength.strength >= 60 ? 'text-warning' : 'text-destructive'
                                    }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>

                            {(focusedField === 'password' || passwordStrength.strength < 100) && (
                                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-2">
                                        Password requirements:
                                    </p>
                                    {passwordStrength.requirements.map((req, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            {req.met ? (
                                                <Check className="h-3 w-3 text-success" />
                                            ) : (
                                                <X className="h-3 w-3 text-muted-foreground" />
                                            )}
                                            <span className={`text-xs ${req.met ? 'text-success' : 'text-muted-foreground'
                                                }`}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {errors.password && (
                        <p
                            id="register-password-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Submit button */}
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
                            <span>Creating account...</span>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>
                                {formData.role === 'candidate' ? 'Create my candidate profile' : 'Create my recruiter workspace'}
                            </span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    )}
                </Button>
            </div>

            <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-primary hover:underline font-medium focus:outline-none focus:underline transition-all"
                        disabled={isLoading}
                    >
                        Sign in
                    </button>
                </p>
            </div>
        </Card>
    );
};