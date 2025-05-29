"use client"

import React from 'react';
import {
    User,
    Mail,
    Edit2,
    Save,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ProfileFormData } from '@/types/profile';

// ==================== TYPES ====================

interface PersonalInfoFormProps {
    formData: ProfileFormData;
    isEditing: boolean;
    isLoading: boolean;
    errors: Record<string, string>;
    isValid: boolean;
    onInputChange: (field: keyof ProfileFormData, value: string) => void;
    onEdit: () => void;
    onCancel: () => void;
    onSave: () => void;
}

// ==================== COMPOSANT FORM INFORMATIONS PERSONNELLES ====================

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
    formData,
    isEditing,
    isLoading,
    errors,
    isValid,
    onInputChange,
    onEdit,
    onCancel,
    onSave
}) => {
    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Informations personnelles</h3>
                {!isEditing ? (
                    <Button
                        variant="outline"
                        onClick={onEdit}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Modifier
                    </Button>
                ) : (
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="hover:bg-muted"
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={onSave}
                            disabled={isLoading || !isValid}
                            className="min-w-[120px]"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Sauvegarder
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Champ Prénom */}
                <div className="space-y-2">
                    <label
                        htmlFor="firstName"
                        className="text-sm font-medium text-foreground"
                    >
                        Prénom <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                        <Input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => onInputChange('firstName', e.target.value)}
                            className={`pl-10 transition-colors ${errors.firstName
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={!isEditing || isLoading}
                            placeholder="Votre prénom"
                            aria-invalid={!!errors.firstName}
                            aria-describedby={errors.firstName ? "firstName-error" : undefined}
                        />
                    </div>
                    {errors.firstName && (
                        <p
                            id="firstName-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.firstName}
                        </p>
                    )}
                </div>

                {/* Champ Nom */}
                <div className="space-y-2">
                    <label
                        htmlFor="lastName"
                        className="text-sm font-medium text-foreground"
                    >
                        Nom <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                        <Input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => onInputChange('lastName', e.target.value)}
                            className={`pl-10 transition-colors ${errors.lastName
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={!isEditing || isLoading}
                            placeholder="Votre nom"
                            aria-invalid={!!errors.lastName}
                            aria-describedby={errors.lastName ? "lastName-error" : undefined}
                        />
                    </div>
                    {errors.lastName && (
                        <p
                            id="lastName-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.lastName}
                        </p>
                    )}
                </div>

                {/* Champ Email */}
                <div className="md:col-span-2 space-y-2">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                    >
                        Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 pointer-events-none" />
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => onInputChange('email', e.target.value)}
                            className={`pl-10 transition-colors ${errors.email
                                ? 'border-destructive focus:border-destructive'
                                : 'focus:border-primary'
                                }`}
                            disabled={!isEditing || isLoading}
                            placeholder="votre@email.com"
                            aria-invalid={!!errors.email}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            autoComplete="email"
                        />
                    </div>
                    {errors.email && (
                        <p
                            id="email-error"
                            className="text-sm text-destructive animate-slide-up"
                            role="alert"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Indicateur de validation */}
            {isEditing && (
                <div className="mt-4 flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full transition-colors ${isValid ? 'bg-success' : 'bg-muted-foreground'
                        }`} />
                    <span className="text-xs text-muted-foreground">
                        {isValid ? 'Toutes les informations sont valides' : 'Veuillez corriger les erreurs'}
                    </span>
                </div>
            )}
        </Card>
    );
};

export default PersonalInfoForm;