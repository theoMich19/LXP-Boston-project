import React, { useState } from 'react';
import {
    X,
    Briefcase,
    DollarSign,
    FileText,
    Tag,
    Loader2,
    Plus,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Types pour la création d'offre d'emploi
interface CreateJobFormData {
    title: string;
    description: string;
    salary_min: number | '';
    salary_max: number | '';
}

interface CreateJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobCreated?: (newJob: any) => void;
}

// Composant principal de la modal
export const CreateJobModal: React.FC<CreateJobModalProps> = ({
    isOpen,
    onClose,
    onJobCreated
}) => {
    const [formData, setFormData] = useState<CreateJobFormData>({
        title: '',
        description: '',
        salary_min: '',
        salary_max: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    // Validation du formulaire
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validation du titre (minimum 5 caractères)
        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est requis';
        } else if (formData.title.trim().length < 5) {
            newErrors.title = 'Le titre doit contenir au moins 5 caractères';
        }

        // Validation de la description (minimum 20 caractères)
        if (!formData.description.trim()) {
            newErrors.description = 'La description est requise';
        } else if (formData.description.trim().length < 20) {
            newErrors.description = 'La description doit contenir au moins 20 caractères';
        }

        if (formData.salary_min && formData.salary_max) {
            if (Number(formData.salary_min) >= Number(formData.salary_max)) {
                newErrors.salary_max = 'Le salaire maximum doit être supérieur au minimum';
            }
        }

        if (formData.salary_min && Number(formData.salary_min) < 0) {
            newErrors.salary_min = 'Le salaire minimum doit être positif';
        }

        if (formData.salary_max && Number(formData.salary_max) < 0) {
            newErrors.salary_max = 'Le salaire maximum doit être positif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Fonction pour créer l'offre d'emploi
    const handleCreateJob = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Token d\'authentification manquant. Veuillez vous connecter.');
            }

            const requestBody = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                salary_min: formData.salary_min ? Number(formData.salary_min) : 0,
                salary_max: formData.salary_max ? Number(formData.salary_max) : 0,
                tags: [] // Envoyer un tableau vide pour l'instant, car l'API semble attendre des IDs de tags
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                }
                if (response.status === 403) {
                    throw new Error('Accès non autorisé à cette fonctionnalité.');
                }
                if (response.status === 400) {
                    const errorData = await response.json().catch(() => null);

                    // Gestion des erreurs de validation détaillées
                    if (errorData?.detail && Array.isArray(errorData.detail)) {
                        const validationErrors: Record<string, string> = {};

                        errorData.detail.forEach((error: any) => {
                            const field = error.loc?.[1]; // ['body', 'field_name']
                            const message = error.msg;

                            if (field === 'title') {
                                validationErrors.title = 'Le titre doit contenir au moins 5 caractères';
                            } else if (field === 'description') {
                                validationErrors.description = 'La description doit contenir au moins 20 caractères';
                            } else if (field === 'tags') {
                                validationErrors.tags = 'Format des compétences invalide';
                            } else {
                                validationErrors[field] = message;
                            }
                        });

                        setErrors(validationErrors);
                        return;
                    }

                    throw new Error(errorData?.message || 'Données invalides.');
                }

                throw new Error(`Erreur HTTP: ${response.status}`);
            }

            const newJob = await response.json();

            // Callback pour notifier le parent
            onJobCreated?.(newJob);

            // Réinitialiser le formulaire
            setFormData({
                title: '',
                description: '',
                salary_min: '',
                salary_max: '',
                tags: []
            });

            // Fermer la modal
            onClose();

            console.log('✅ Offre d\'emploi créée avec succès:', newJob);

        } catch (error) {
            console.error('❌ Erreur lors de la création de l\'offre:', error);

            setErrors({
                general: error instanceof Error ? error.message : 'Erreur lors de la création de l\'offre'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Gestion des changements de formulaire
    const handleInputChange = (field: keyof CreateJobFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-foreground">
                                Créer une offre d'emploi
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Ajoutez une nouvelle offre pour attirer les meilleurs talents
                            </p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Erreur générale */}
                {errors.general && (
                    <div className="mx-6 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <p className="text-sm text-destructive">{errors.general}</p>
                    </div>
                )}

                {/* Formulaire */}
                <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Titre du poste <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="ex: Développeur Frontend React Senior"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className={`pl-10 ${errors.title ? 'border-destructive' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {formData.title.length}/50 (min. 5)
                            </p>
                        </div>
                    </div>

                    {/* Salaires */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Salaire minimum (€/an)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    type="number"
                                    placeholder="45000"
                                    value={formData.salary_min}
                                    onChange={(e) => handleInputChange('salary_min', e.target.value ? Number(e.target.value) : '')}
                                    className={`pl-10 ${errors.salary_min ? 'border-destructive' : ''}`}
                                    disabled={isLoading}
                                    min="0"
                                />
                            </div>
                            {errors.salary_min && (
                                <p className="text-sm text-destructive">{errors.salary_min}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                Salaire maximum (€/an)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                                <Input
                                    type="number"
                                    placeholder="60000"
                                    value={formData.salary_max}
                                    onChange={(e) => handleInputChange('salary_max', e.target.value ? Number(e.target.value) : '')}
                                    className={`pl-10 ${errors.salary_max ? 'border-destructive' : ''}`}
                                    disabled={isLoading}
                                    min="0"
                                />
                            </div>
                            {errors.salary_max && (
                                <p className="text-sm text-destructive">{errors.salary_max}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Description du poste <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
                            <textarea
                                placeholder="Décrivez les missions, compétences requises, avantages... (minimum 20 caractères)"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`w-full pl-10 pr-4 py-3 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none ${errors.description ? 'border-destructive focus:border-destructive focus:ring-destructive' : 'border-input'}`}
                                rows={6}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex justify-between items-center">
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {formData.description.length} (min. 20)
                            </p>
                        </div>
                    </div>

                    {/* Tags/Compétences - Temporairement désactivé */}
                    <div className="space-y-2 opacity-50">
                        <label className="text-sm font-medium text-foreground">
                            Compétences requises
                        </label>
                        <div className="p-4 bg-muted/50 rounded-lg border border-dashed">
                            <p className="text-sm text-muted-foreground text-center">
                                🚧 Section temporairement désactivée<br />
                                L'API nécessite des IDs de compétences spécifiques
                            </p>
                        </div>
                        {errors.tags && (
                            <p className="text-sm text-destructive">{errors.tags}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                        <span className="text-destructive">*</span> Champs obligatoires
                    </div>
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleCreateJob}
                            disabled={isLoading || !formData.title.trim() || !formData.description.trim()}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Création...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Plus className="w-4 h-4" />
                                    <span>Créer l'offre</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};