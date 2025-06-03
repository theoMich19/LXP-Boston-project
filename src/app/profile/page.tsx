"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { useUser } from '@/context/userContext';
import { ProfileFormData } from '@/types/profile';
import { PersonalInfoForm } from '@/domains/profile/form/form-personnel';
import ProfileRecapCard from '@/components/profile/profile-recap-card';
import { ProfileCompletudeCard } from '@/components/profile/profile-completude-card';
import { CVUploadForm } from '@/domains/profile/form/form-cv';

const ProfilePage: React.FC = () => {
    const { user, isAuthenticated } = useUser();
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    } | null>(null);

    const [errors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            });
        }
    }, [user]);

    const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSaveProfile = useCallback(async () => {
        setIsLoading(true);
        setAlert(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

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
    }, [formData]);

    const handleCancelEdit = useCallback(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            });
        }
        setIsEditing(false);
        setAlert(null);
    }, [user]);

    useEffect(() => {
        if (alert) {
            const timeout = setTimeout(() => setAlert(null), 5000);
            return () => clearTimeout(timeout);
        }
    }, [alert]);

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Chargement du profil...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
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
                                } animate-fade-in`}
                        >
                            {alert.message}
                        </Alert>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="space-y-6">
                        <ProfileRecapCard user={user} />
                        <ProfileCompletudeCard user={user} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <PersonalInfoForm
                            formData={formData}
                            isEditing={isEditing}
                            isLoading={isLoading}
                            errors={errors}
                            onInputChange={handleInputChange}
                            onEdit={() => setIsEditing(true)}
                            onCancel={handleCancelEdit}
                            onSave={handleSaveProfile}
                        />
                        <CVUploadForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;