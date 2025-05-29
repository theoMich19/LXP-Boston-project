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


// Composant principal de la liste
export const JobsList: React.FC<ListJobsProps> = ({
    jobsData,
    loading = false,
    onViewDetails,
    onApply,
    onToggleFavorite
}) => {
    if (loading) {
        return (
            <div className="w-full max-w-[70%] space-y-4">
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
            <div className="w-full max-w-[70%]">
                <Card className="p-12 text-center">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                            <Building className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                No Jobs Found
                            </h3>
                            <p className="text-muted-foreground">
                                We couldn&apos;t find any jobs matching your criteria. Try adjusting your search filters.
                            </p>
                        </div>
                        <Button variant="outline" className="mt-4">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Browse All Jobs
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[70%] space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-foreground">
                        Job Matches
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        {jobsData.message}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                        {jobsData.total_matches}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Total Matches
                    </div>
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
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>

            {jobsData.total_matches > jobsData.data.length && (
                <div className="text-center pt-6">
                    <Button variant="outline" size="lg">
                        Load More Jobs
                    </Button>
                </div>
            )}
        </div>
    );
};

