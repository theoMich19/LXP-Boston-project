"use client";

import React from 'react';
import {
    X,
    Building,
    DollarSign,
    MapPin,
    Calendar,
    Clock,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { JobMatch } from '@/types/jobs';

interface JobDetailsModalProps {
    job: JobMatch | null;
    isOpen: boolean;
    onClose: () => void;
}

const companies = {
    1: { name: "TechCorp Solutions", logo: "TC" },
    2: { name: "InnovateLab", logo: "IL" },
    3: { name: "ConseilTech", logo: "CT" },
    4: { name: "DataFlow", logo: "DF" },
    5: { name: "GlobalSoft", logo: "GS" }
};

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
    job,
    isOpen,
    onClose
}) => {
    if (!isOpen || !job) return null;

    const formatSalary = (min: string, max: string) => {
        const minK = Math.round(parseFloat(min) / 1000);
        const maxK = Math.round(parseFloat(max) / 1000);
        return `${minK}k - ${maxK}k €`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const jobDate = new Date(dateString);
        const diffInDays = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Aujourd'hui";
        if (diffInDays === 1) return "Hier";
        return `Il y a ${diffInDays} jours`;
    };

    const company = companies[job.company_id as keyof typeof companies] || {
        name: `Entreprise ${job.company_id}`,
        logo: "EN"
    };

    const formatDescription = (description: string) => {
        return description.split('\r\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < description.split('\r\n').length - 1 && <br />}
            </React.Fragment>
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <Card className="relative w-full container max-h-[90vh] mx-4 overflow-hidden bg-background">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border">
                    <div className="flex items-start space-x-4 flex-1">
                        <Avatar />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground mb-2">
                                {job.title}
                            </h1>
                            <div className="flex items-center space-x-1 text-muted-foreground mb-3">
                                <Building className="h-5 w-5" />
                                <span className="text-lg font-medium">{company.name}</span>
                            </div>
                            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Remote Available</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{getTimeAgo(job?.created_at)}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="shrink-0"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <div className="p-6 space-y-6">
                        {/* Status and Date */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Badge
                                    variant={job.status === 'active' ? 'default' : 'secondary'}
                                    className="capitalize"
                                >
                                    {job.status === 'active' ? 'Actif' : job.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Publié le {formatDate(job?.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                Description du poste
                            </h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed bg-muted/20 rounded-lg p-4">
                                {formatDescription(job.description)}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="bg-muted/30 rounded-lg p-4">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center">
                                <Building className="h-5 w-5 mr-2" />
                                Informations sur l'entreprise
                            </h3>
                            <div className="flex items-center space-x-3">
                                <Avatar />
                                <div>
                                    <p className="font-medium text-foreground">{company.name}</p>
                                    <p className="text-sm text-muted-foreground">Identifiant: {job.company_id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Job Details Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Détails du poste
                                </h3>
                                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Salaire:</span>
                                        <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Type de contrat:</span>
                                        <span className="font-medium">CDI</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Localisation:</span>
                                        <span className="font-medium">Remote / Hybride</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Niveau requis:</span>
                                        <span className="font-medium">2-5 ans d'expérience</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center">
                                    <Info className="h-5 w-5 mr-2" />
                                    Informations générales
                                </h3>
                                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ID de l'offre:</span>
                                        <span className="font-mono font-medium">#{job.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Statut:</span>
                                        <Badge variant="outline" className="text-xs">
                                            {job.status === 'active' ? 'Actif' : job.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date de publication:</span>
                                        <span className="font-medium">{getTimeAgo(job.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date complète:</span>
                                        <span className="font-medium text-xs">{formatDate(job.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};