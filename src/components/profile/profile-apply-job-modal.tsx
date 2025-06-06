import React, { useState } from 'react';
import {
    X,
    Mail,
    Calendar,
    Check,
    XCircle,
    Eye,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

interface CandidateApplication {
    id: number;
    user_id: number;
    job_offer_id: number;
    status: 'pending' | 'accepted' | 'rejected';
    applied_at: string;
    job_title: string;
    company_name: string;
    job_salary_min: number | null;
    job_salary_max: number | null;
    candidate_first_name: string;
    candidate_last_name: string;
    candidate_email: string;
}

interface ApplicationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    applications: CandidateApplication[] | [];
    jobTitle?: string;
    onStatusUpdate?: (applicationId: number, newStatus: 'accepted' | 'rejected') => void;
    onViewCandidate?: (userId: number) => void;
    isLoading?: boolean;
}

const ApplicationItem = ({
    application,
    onStatusUpdate,
    onViewCandidate,
    isUpdating
}: {
    application: CandidateApplication;
    onStatusUpdate?: (applicationId: number, newStatus: 'accepted' | 'rejected') => void;
    onViewCandidate?: (userId: number) => void;
    isUpdating?: boolean;
}) => {
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
            case 'accepted':
                return <Badge variant="default" className="bg-success text-success-foreground">Accepted</Badge>;
            case 'rejected':
                return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusUpdate = async (newStatus: 'accepted' | 'rejected') => {
        setIsChangingStatus(true);
        try {
            await onStatusUpdate?.(application.id, newStatus);
        } finally {
            setIsChangingStatus(false);
        }
    };

    return (
        <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                        <Avatar className="h-10 w-10 bg-primary/10 text-primary font-semibold" />
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground">
                                {application.candidate_first_name} {application.candidate_last_name}
                            </h3>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                                <Mail className="h-4 w-4" />
                                <span>{application.candidate_email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground mt-1">
                                <Calendar className="h-4 w-4" />
                                <span>Applied on {formatDate(application.applied_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {getStatusBadge(application.status)}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center space-x-2">
                    </div>

                    {application.status === 'pending' && (
                        <div className="flex space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusUpdate('rejected')}
                                disabled={isChangingStatus || isUpdating}
                                className="border-destructive/20 text-destructive hover:bg-destructive/10"
                            >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => handleStatusUpdate('accepted')}
                                disabled={isChangingStatus || isUpdating}
                                className="bg-success hover:bg-success/90 text-success-foreground"
                            >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

// Main modal component
export const ApplicationsModal: React.FC<ApplicationsModalProps> = ({
    isOpen,
    onClose,
    applications,
    jobTitle,
    onStatusUpdate,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const getStatusCounts = () => {
        return {
            total: applications.length,
            pending: applications.filter(app => app.status === 'pending').length,
            accepted: applications.filter(app => app.status === 'accepted').length,
            rejected: applications.filter(app => app.status === 'rejected').length
        };
    };

    const statusCounts = getStatusCounts();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-xl font-semibold text-foreground">
                            Applications{jobTitle && ` - ${jobTitle}`}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {statusCounts.total} application{statusCounts.total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Applications list */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, index) => (
                                <Card key={index} className="p-4">
                                    <div className="animate-pulse space-y-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-10 w-10 bg-muted rounded-full"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-1/3 bg-muted rounded"></div>
                                                <div className="h-3 w-1/2 bg-muted rounded"></div>
                                            </div>
                                            <div className="h-6 w-20 bg-muted rounded"></div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        // <div className="text-center py-12">
                        //     <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        //         <User className="h-8 w-8 text-muted-foreground" />
                        //     </div>
                        //     <h3 className="text-lg font-semibold text-foreground mb-2">
                        //         {searchTerm || statusFilter !== 'all'
                        //             ? 'No applications found'
                        //             : 'No applications'}
                        //     </h3>
                        //     <p className="text-muted-foreground">
                        //         {searchTerm || statusFilter !== 'all'
                        //             ? 'Try modifying your search filters.'
                        //             : 'Applications will appear here once candidates have applied.'}
                        //     </p>
                        // </div>
                        <></>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((application) => (
                                <ApplicationItem
                                    key={application.id}
                                    application={application}
                                    onStatusUpdate={onStatusUpdate}
                                    isUpdating={isLoading}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
                    <div className="text-sm text-muted-foreground">
                        {applications.length} application{applications.length !== 1 ? 's' : ''} displayed
                    </div>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};