import React from 'react';
import {
    Briefcase,
    Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CompanyData } from '@/types/company';
import { JobOfferItem } from './profile-applyJob-list-item';


export const ApplyJob = ({
    companyData,
    handleViewJob,
    handleViewCandidateApplyJob,
}: {
    companyData: CompanyData | null,
    handleViewJob: (jobId: number) => void,
    handleViewCandidateApplyJob: (jobId: number) => void
}) => {

    const handleCreateJob = () => {
        console.log('Create new job');
        // Logique pour créer une nouvelle offre
    };

    const jobOffers = companyData?.job_offers || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Mes offres d'emploi
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Gérez vos offres d'emploi et suivez les candidatures
                    </p>
                </div>
                <Button onClick={handleCreateJob}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvelle offre
                </Button>
            </div>

            {jobOffers.length === 0 ? (
                <Card className="p-12 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Briefcase className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Aucune offre d'emploi
                            </h3>
                            <p className="text-muted-foreground">
                                Commencez par créer votre première offre d'emploi pour attirer les meilleurs talents.
                            </p>
                        </div>
                        <Button onClick={handleCreateJob} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Créer ma première offre
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-4">
                    {jobOffers.length !== 0 && jobOffers.map((jobOffer) => (
                        <JobOfferItem
                            key={jobOffer.id}
                            jobOffer={jobOffer}
                            onView={handleViewJob}
                            onShowCandidate={handleViewCandidateApplyJob}

                        />
                    ))}
                </div>
            )}
        </div>
    );
};

