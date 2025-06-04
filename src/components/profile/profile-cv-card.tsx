import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, CheckCircle, Calendar, AlertCircle } from 'lucide-react';

// Composant pour l'état de chargement
export const CVLoadingSkeleton = () => (
    <Card className="p-6">
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    </Card>
);

// Composant pour CV existant
export const CVExistingCard = ({ lastUploadDate }) => (
    <Card className="p-6 border-success/20 bg-success/5">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <FileText className="h-4 w-4 text-success" />
                    <h3 className="font-semibold text-foreground">CV enregistré</h3>
                    <Badge variant="success" className="text-xs">
                        Actif
                    </Badge>
                </div>

                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Dernière mise à jour le {new Date(lastUploadDate).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })}</span>
                </div>

                <p className="text-sm text-success mt-2">
                    Votre CV est prêt à être utilisé pour vos candidatures
                </p>
            </div>
        </div>
    </Card>
);

// Composant pour aucun CV
export const CVEmptyCard = () => (
    <Card className="p-6 border-warning/20 bg-warning/5">
        <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-warning" />
                </div>
            </div>

            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <Upload className="h-4 w-4 text-warning" />
                    <h3 className="font-semibold text-foreground">Aucun CV enregistré</h3>
                    <Badge variant="outline" className="text-xs border-warning text-warning">
                        Action requise
                    </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                    Ajoutez votre CV pour améliorer vos chances d'être contacté par les recruteurs
                </p>

                <div className="flex items-center space-x-1 text-xs text-warning">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span>Complétez votre profil pour un meilleur matching</span>
                </div>
            </div>
        </div>
    </Card>
);
