"use client";

import React from 'react';
import {
    Building,
    ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ListJobsProps } from '@/types/jobs';
import { JobItem } from './jobs-item';

export const JobsList: React.FC<ListJobsProps> = ({
    dataJobsApply,
    jobsData,
    loading = false,
    onViewDetails,
    onApply,
    companies,
}) => {
    const getJobsApply = (jobOfferId: number) => dataJobsApply.find((jobs) => jobs.job_offer_id === jobOfferId);

    const getCompanies = (company_id: number) => companies.find((company) => company.id === company_id);

    if (loading) {
        return (
            <div className="w-full space-y-4">
                <div className="flex items-center justify-between mb-6">
                    <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                </div>
                {[...Array(3)].map((_, index) => (
                    <Card key={index} className="p-6">
                        <div className="animate-pulse space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="h-12 w-12 bg-muted rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                                    <div className="h-4 w-1/2 bg-muted rounded"></div>
                                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                                </div>
                                <div className="h-12 w-12 bg-muted rounded-full"></div>
                            </div>
                            <div className="h-12 w-full bg-muted rounded"></div>
                            <div className="flex space-x-2">
                                <div className="h-6 w-20 bg-muted rounded"></div>
                                <div className="h-6 w-20 bg-muted rounded"></div>
                                <div className="h-6 w-20 bg-muted rounded"></div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!jobsData || jobsData.data.length === 0) {
        return (
            <div className="w-full">
                <Card className="p-12 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No jobs found
                            </h3>
                            <p className="text-muted-foreground">
                                We couldn't find any jobs matching your criteria. Try adjusting your search filters.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Browse all jobs
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Matching Offers
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {jobsData.message}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {jobsData.data.map((job) => (
                    <JobItem
                        key={job.id}
                        job={job}
                        userSkills={jobsData.user_skills}
                        onViewDetails={onViewDetails}
                        onApply={onApply}
                        isJobsApply={getJobsApply(job.id)}
                        company={getCompanies(job.company_id)}
                    />
                ))}
            </div>

            {jobsData.total_matches > jobsData.data.length && (
                <div className="text-center pt-6">
                    <Button variant="outline" size="lg">
                        Load more jobs
                    </Button>
                </div>
            )}
        </div>
    );
};