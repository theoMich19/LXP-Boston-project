import React from 'react';
import {
    Eye,
    Calendar,
    DollarSign,
    MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobMatch } from '@/types/jobs';

export const JobOfferItem = ({
    jobOffer,
    onEdit,
    onView,
}: {
    jobOffer: JobMatch;
    onEdit?: (id: number) => void;
    onView?: (id: number) => void;
}) => {
    const formatSalary = (min: number, max: number) => {
        const minK = Math.round(min / 1000);
        const maxK = Math.round(max / 1000);
        return `${minK}k - ${maxK}k €`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge variant="default" className="bg-success text-success-foreground">Actif</Badge>;
            case 'paused':
                return <Badge variant="secondary">En pause</Badge>;
            case 'closed':
                return <Badge variant="outline">Fermé</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground line-clamp-1">
                                {jobOffer.title}
                            </h3>
                            {getStatusBadge(jobOffer.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{formatSalary(jobOffer.salary_min, jobOffer.salary_max)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>Publié le {formatDate(jobOffer.created_at)}</span>
                            </span>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-3">
                    {jobOffer.description}
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm text-muted-foreground">
                            {jobOffer.status === 'active' ? 'Visible aux candidats' : 'Non visible'}
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onView?.(jobOffer.id)}
                        >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                        </Button>
                        {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(jobOffer.id)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                        </Button> */}
                    </div>
                </div>
            </div>
        </Card>
    );
};