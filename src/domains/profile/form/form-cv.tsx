"use client";

import React, { useState, useCallback, useRef } from 'react';
import {
    FileText,
    Upload,
    Loader2,
    AlertCircle,
    Check
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useCVValidation } from '@/hooks/useZodValidationProfile';

export const CVUploadForm: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'warning';
        message: string;
    } | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { errors, isValid, validateFile, clearErrors } = useCVValidation();

    // Fonction pour formater la taille des fichiers
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    // FONCTION CORRIGÉE pour l'API
    const uploadCVToAPI = async (file: File): Promise<void> => {
        const formData = new FormData();
        // CORRECTION: Utiliser 'cv_file' selon votre documentation API
        formData.append('cv_file', file);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Token d\'authentification manquant');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cvs/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Le Content-Type est automatiquement défini par le navigateur pour FormData
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));

                // Gestion spécifique des erreurs 422 (validation)
                if (response.status === 422) {
                    let errorMessage = 'Erreur de validation des données';

                    if (errorData.detail) {
                        if (Array.isArray(errorData.detail)) {
                            errorMessage = errorData.detail.map((err: any) =>
                                `${err.loc ? err.loc.join('.') : 'Champ'}: ${err.msg}`
                            ).join(', ');
                        } else {
                            errorMessage = errorData.detail;
                        }
                    }

                    throw new Error(errorMessage);
                }

                throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
            }

            // Succès
            const data = await response.json();
            console.log('CV uploadé avec succès:', data);
        } catch (error) {
            console.error('Erreur upload CV:', error);
            throw error;
        }
    };

    // Gestion de la sélection de fichier
    const handleFileSelect = useCallback((file: File) => {
        setSelectedFile(file);
        setUploadSuccess(false);
        setAlert(null);

        if (!validateFile(file)) {
            return;
        }
    }, [validateFile]);

    // Gestion du changement de fichier via input
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Gestion du drag & drop
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            handleFileSelect(files[0]);
        }
    }, [handleFileSelect]);

    // Soumission du formulaire
    const handleSubmit = useCallback(async () => {
        if (!selectedFile || !isValid) {
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setAlert(null);

        try {
            // Simulation de progression
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 150);

            await uploadCVToAPI(selectedFile);

            clearInterval(progressInterval);
            setUploadProgress(100);

            // Succès
            setTimeout(() => {
                setUploadSuccess(true);
                setAlert({
                    type: 'success',
                    message: `CV "${selectedFile.name}" uploadé avec succès !`
                });
                setUploadProgress(0);
                setSelectedFile(null);
                clearErrors();

                // Reset l'input file
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 500);

        } catch (error) {
            setAlert({
                type: 'error',
                message: error instanceof Error ? error.message : 'Erreur lors de l\'upload du CV'
            });
            setUploadProgress(0);
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, isValid, clearErrors]);

    // Reset du formulaire
    const handleReset = useCallback(() => {
        setSelectedFile(null);
        setUploadSuccess(false);
        setAlert(null);
        clearErrors();
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [clearErrors]);

    // Auto-dismiss des alertes
    React.useEffect(() => {
        if (alert) {
            const timeout = setTimeout(() => setAlert(null), 7000);
            return () => clearTimeout(timeout);
        }
    }, [alert]);

    return (
        <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Uploader un CV
            </h3>

            {/* Alert */}
            {alert && (
                <div className="mb-4">
                    <Alert
                        title={alert.type === 'success' ? 'Succès' : alert.type === 'error' ? 'Erreur' : 'Attention'}
                        className={`${alert.type === 'success' ? 'border-success bg-success/10' :
                            alert.type === 'error' ? 'border-destructive bg-destructive/10' :
                                'border-warning bg-warning/10'
                            } animate-fade-in`}
                    >
                        {alert.message}
                    </Alert>
                </div>
            )}

            {/* Zone d'upload */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 mb-4
                    ${dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
                    ${isUploading ? 'pointer-events-none opacity-75' : ''}
                    ${selectedFile && isValid ? 'border-success bg-success/5' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="space-y-4">
                        <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                        <div>
                            <p className="text-lg font-medium mb-2">Upload en cours...</p>
                            <Progress value={uploadProgress} className="h-2 max-w-xs mx-auto" />
                            <p className="text-sm text-muted-foreground mt-1">{uploadProgress}%</p>
                        </div>
                    </div>
                ) : uploadSuccess ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                            <Check className="h-8 w-8 text-success" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-success">CV uploadé avec succès !</p>
                            <p className="text-muted-foreground">Vous pouvez uploader un autre CV</p>
                        </div>
                        <Button variant="outline" onClick={handleReset}>
                            Uploader un autre CV
                        </Button>
                    </div>
                ) : selectedFile && isValid ? (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
                            <FileText className="h-8 w-8 text-success" />
                        </div>
                        <div>
                            <p className="text-lg font-medium text-success">Fichier sélectionné</p>
                            <p className="text-foreground font-medium">{selectedFile.name}</p>
                            <p className="text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">
                                {dragActive ? 'Déposez votre CV ici' : 'Glissez-déposez votre CV ou cliquez pour parcourir'}
                            </p>
                            <p className="text-muted-foreground">PDF, DOC ou DOCX (max 5MB)</p>
                        </div>
                        <Button variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Choisir un fichier
                        </Button>
                    </div>
                )}
            </div>

            {/* Erreurs de validation */}
            {errors.length > 0 && (
                <div className="mb-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                    <div className="flex items-start space-x-2">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-medium text-destructive mb-1">Erreurs de validation :</p>
                            <ul className="list-disc list-inside space-y-1">
                                {errors.map((error, index) => (
                                    <li key={index} className="text-sm text-destructive">{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Boutons d'action */}
            {selectedFile && !uploadSuccess && (
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={handleReset} disabled={isUploading}>
                        Annuler
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isUploading}
                        className="min-w-[120px]"
                    >
                        {isUploading ? (
                            <Button>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Upload...
                            </Button>
                        ) : (
                            <Button>
                                <Upload className="h-4 w-4 mr-2" />
                                Uploader
                            </Button>
                        )}
                    </Button>
                </div>
            )}

            {/* Message informatif */}
            {!selectedFile && !uploadSuccess && (
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
    );
};