"use client"
import React, { useState, useCallback, useRef } from 'react';
import {
    User,
    FileText,
    X,
    Check,
    AlertCircle,
    Camera,
    Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/header/header';
import { profileSchema } from '@/domains/profile/schema/schema';
import { useZodValidation } from '@/hooks/useZodValidationAuth';
import { ProfileData, ProfilePageProps, ProfileFormData } from '@/types/profile';
import { CVUploadZone } from '@/domains/profile/form/form-cv';
import PersonalInfoForm from '@/domains/profile/form/form-personnel';


const ProfilePage: React.FC<ProfilePageProps> = ({
    initialData,
    onProfileUpdate,
    onCVUpload,
    onCVDelete,
    onAvatarUpload
}) => {
    // États du composant
    const [profileData, setProfileData] = useState<ProfileData>(
        initialData || {
            id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            profileCompleteness: 75,
            joinDate: '2024-01-15',
            cv: {
                name: 'CV_Jean_Dupont.pdf',
                url: '/cv/jean-dupont.pdf',
                uploadDate: '2024-12-01',
                size: 245760
            }
        }
    );

    const [formData, setFormData] = useState<ProfileFormData>({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingCV, setIsUploadingCV] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    } | null>(null);

    const avatarInputRef = useRef<HTMLInputElement>(null);

    // Hook de validation
    const { errors, validate, clearFieldError, isValid } = useZodValidation(profileSchema, formData);

    // Gestion des changements de formulaire
    const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        clearFieldError(field);
    }, [clearFieldError]);

    // Sauvegarde du profil
    const handleSaveProfile = useCallback(async () => {
        const isFormValid = await validate();
        if (!isFormValid) return;

        setIsLoading(true);
        setAlert(null);

        try {
            await onProfileUpdate?.(formData);

            setProfileData(prev => ({
                ...prev,
                ...formData
            }));

            setIsEditing(false);
            setAlert({
                type: 'success',
                message: 'Profil mis à jour avec succès !'
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Erreur lors de la mise à jour du profil'
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, validate, onProfileUpdate]);

    // Annulation de l'édition
    const handleCancelEdit = useCallback(() => {
        setFormData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
        });
        setIsEditing(false);
        setAlert(null);
    }, [profileData]);

    // Upload du CV
    const handleCVUpload = useCallback(async (file: File) => {
        setIsUploadingCV(true);
        setAlert(null);

        try {
            const url = await onCVUpload?.(file);

            setProfileData(prev => ({
                ...prev,
                cv: {
                    name: file.name,
                    url: url || '',
                    uploadDate: new Date().toISOString(),
                    size: file.size
                },
                profileCompleteness: Math.min(prev.profileCompleteness + 10, 100)
            }));

            setAlert({
                type: 'success',
                message: 'CV uploadé avec succès !'
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Erreur lors de l\'upload du CV'
            });
        } finally {
            setIsUploadingCV(false);
        }
    }, [onCVUpload]);

    // Suppression du CV
    const handleCVDelete = useCallback(async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer votre CV ?')) return;

        try {
            await onCVDelete?.();

            setProfileData(prev => ({
                ...prev,
                cv: undefined,
                profileCompleteness: Math.max(prev.profileCompleteness - 10, 0)
            }));

            setAlert({
                type: 'success',
                message: 'CV supprimé avec succès'
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Erreur lors de la suppression du CV'
            });
        }
    }, [onCVDelete]);

    // Téléchargement du CV
    const handleCVDownload = useCallback(() => {
        if (profileData.cv?.url) {
            const link = document.createElement('a');
            link.href = profileData.cv.url;
            link.download = profileData.cv.name;
            link.click();
        }
    }, [profileData.cv]);

    // Upload de l'avatar
    const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setAlert({
                type: 'error',
                message: 'Veuillez sélectionner une image'
            });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setAlert({
                type: 'error',
                message: 'L\'image ne peut pas dépasser 2MB'
            });
            return;
        }

        setIsUploadingAvatar(true);
        setAlert(null);

        try {
            const url = await onAvatarUpload?.(file);

            setProfileData(prev => ({
                ...prev,
                avatar: url
            }));

            setAlert({
                type: 'success',
                message: 'Photo de profil mise à jour !'
            });
        } catch (error) {
            setAlert({
                type: 'error',
                message: 'Erreur lors de l\'upload de la photo'
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    }, [onAvatarUpload]);

    // Calcul de la complétude du profil
    const getProfileCompleteness = useCallback(() => {
        let completeness = 0;
        if (profileData.firstName) completeness += 20;
        if (profileData.lastName) completeness += 20;
        if (profileData.email) completeness += 20;
        if (profileData.avatar) completeness += 20;
        if (profileData.cv) completeness += 20;
        return completeness;
    }, [profileData]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (alert) setAlert(null);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [alert]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Alert */}
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Colonne de gauche - Informations de base */}
                    <div className="space-y-6">
                        {/* Card Avatar et infos principales */}
                        <Card className="p-6 text-center">
                            <div className="relative inline-block mb-4">
                                <Avatar
                                    src={profileData.avatar}
                                    fallback={`${profileData.firstName[0]}${profileData.lastName[0]}`}
                                    size="xl"
                                    className="mx-auto"
                                />
                                <button
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
                                    disabled={isUploadingAvatar}
                                >
                                    {isUploadingAvatar ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                </button>
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-foreground mb-2">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <p className="text-muted-foreground mb-4">{profileData.email}</p>

                            <Badge variant="secondary" className="mb-4">
                                Membre depuis {new Date(profileData.joinDate).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long'
                                })}
                            </Badge>
                        </Card>

                        {/* Card Complétude du profil */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Complétude du profil
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span>Progression</span>
                                        <span>{getProfileCompleteness()}%</span>
                                    </div>
                                    <Progress value={getProfileCompleteness()} className="h-2" />
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span>Informations de base</span>
                                        <Check className="h-4 w-4 text-success" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Photo de profil</span>
                                        {profileData.avatar ? (
                                            <Check className="h-4 w-4 text-success" />
                                        ) : (
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>CV téléchargé</span>
                                        {profileData.cv ? (
                                            <Check className="h-4 w-4 text-success" />
                                        ) : (
                                            <X className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Colonne de droite - Formulaire et CV */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Card Informations personnelles */}
                        <PersonalInfoForm
                            formData={formData}
                            isEditing={isEditing}
                            isLoading={isLoading}
                            errors={errors}
                            isValid={isValid}
                            onInputChange={handleInputChange}
                            onEdit={() => setIsEditing(true)}
                            onCancel={handleCancelEdit}
                            onSave={handleSaveProfile}
                        />
                        {/* Card CV */}
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-6 flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Mon CV
                            </h3>

                            <CVUploadZone
                                onFileSelect={handleCVUpload}
                                isUploading={isUploadingCV}
                                currentCV={profileData.cv}
                                onDelete={handleCVDelete}
                                onDownload={handleCVDownload}
                            />

                            {!profileData.cv && (
                                <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                                    <div className="flex items-start space-x-3">
                                        <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-primary">
                                                Uploadez votre CV pour améliorer votre visibilité
                                            </p>
                                            <p className="text-xs text-primary/70 mt-1">
                                                Les profils avec CV reçoivent 3x plus de contacts des recruteurs
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;