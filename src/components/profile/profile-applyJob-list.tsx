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
    setIsModalJobOpen,
    handleViewCandidateApplyJob,
}: {
    companyData: CompanyData | null,
    handleViewJob: (jobId: number) => void,
    setIsModalJobOpen: (status: boolean) => void,
    handleViewCandidateApplyJob: (jobId: number) => void
}) => {

    const jobOffers = companyData?.job_offers || [];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        My Job Offers
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Manage your job offers and track applications
                    </p>
                </div>
                <Button onClick={() => setIsModalJobOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Offer
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
                                No job offers
                            </h3>
                            <p className="text-muted-foreground">
                                Start by creating your first job offer to attract the best talent.
                            </p>
                        </div>
                        <Button onClick={() => setIsModalJobOpen(true)} className="mt-4">
                            <Plus className="h-4 w-4 mr-2" />
                            Create my first offer
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