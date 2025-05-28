"use client";

import React from 'react';
import {
    MapPin,
    DollarSign,
    Clock,
    Eye,
    Send,
    Building,
    Heart,
    ExternalLink,
    Star,
    AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

// Types
interface JobMatch {
    job_id: number;
    title: string;
    company_name: string;
    company_id: number;
    compatibility_score: number;
    matched_skills: string[];
    missing_skills: string[];
    salary_min: string;
    salary_max: string;
    description_preview: string;
}

interface JobsData {
    matches: JobMatch[];
    total_matches: number;
    user_skills: string[];
    message: string;
}

interface JobItemProps {
    job: JobMatch;
    userSkills: string[];
    onViewDetails?: (jobId: number) => void;
    onApply?: (jobId: number) => void;
    onToggleFavorite?: (jobId: number) => void;
}

interface ListJobsProps {
    jobsData?: JobsData;
    loading?: boolean;
    onViewDetails?: (jobId: number) => void;
    onApply?: (jobId: number) => void;
    onToggleFavorite?: (jobId: number) => void;
}

// Composant pour le score de compatibilité
const CompatibilityScore: React.FC<{ score: number; className?: string }> = ({
    score,
    className = ''
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-success';
        if (score >= 40) return 'text-warning';
        return 'text-destructive';
    };

    const getScoreBg = (score: number) => {
        if (score >= 70) return 'bg-success/10 border-success/20';
        if (score >= 40) return 'bg-warning/10 border-warning/20';
        return 'bg-destructive/10 border-destructive/20';
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <div className={`relative w-12 h-12 rounded-full border-2 ${getScoreBg(score)} flex items-center justify-center`}>
                <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                    {score}%
                </span>
            </div>
            <div className="text-xs text-muted-foreground">
                <div>Match</div>
                <div>Score</div>
            </div>
        </div>
    );
};

// Composant pour un item de job
const JobItem: React.FC<JobItemProps> = ({
    job,
    userSkills,
    onViewDetails,
    onApply,
    onToggleFavorite
}) => {
    const {
        job_id,
        title,
        company_name,
        compatibility_score,
        matched_skills,
        missing_skills,
        salary_min,
        salary_max,
        description_preview
    } = job;

    const formatSalary = (min: string, max: string) => {
        const minK = Math.round(parseFloat(min) / 1000);
        const maxK = Math.round(parseFloat(max) / 1000);
        return `${minK}k - ${maxK}k €`;
    };

    const getCompanyInitials = (companyName: string) => {
        return companyName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="p-6 hover:shadow-lg transition-all duration-200 border border-border hover:border-primary/20">
            <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                        <Avatar
                            fallback={getCompanyInitials(company_name)}
                            className="h-12 w-12 bg-primary/10 text-primary font-semibold"
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer transition-colors line-clamp-1">
                                {title}
                            </h3>
                            <div className="flex items-center space-x-1 text-muted-foreground mt-1">
                                <Building className="h-4 w-4" />
                                <span className="text-sm font-medium">{company_name}</span>
                            </div>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatSalary(salary_min, salary_max)}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Remote Available</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>2 days ago</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start space-x-3">
                        <CompatibilityScore score={compatibility_score} />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onToggleFavorite?.(job_id)}
                            className="text-muted-foreground hover:text-destructive"
                        >
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Description */}
                <div className="text-sm text-muted-foreground line-clamp-2">
                    {description_preview}
                </div>

                {/* Skills Section */}
                <div className="space-y-3">
                    {/* Matched Skills */}
                    {matched_skills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <Star className="h-4 w-4 text-success" />
                                <span className="text-sm font-medium text-success">
                                    Matched Skills ({matched_skills.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {matched_skills.slice(0, 6).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-success/10 text-success border-success/20 hover:bg-success/20"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {matched_skills.length > 6 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{matched_skills.length - 6} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Missing Skills */}
                    {missing_skills.length > 0 && (
                        <div>
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertCircle className="h-4 w-4 text-warning" />
                                <span className="text-sm font-medium text-warning">
                                    Skills to Learn ({missing_skills.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {missing_skills.slice(0, 4).map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="bg-warning/5 text-warning border-warning/20 hover:bg-warning/10"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                                {missing_skills.length > 4 && (
                                    <Badge variant="outline" className="text-muted-foreground">
                                        +{missing_skills.length - 4} more
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-2">
                        <Badge
                            variant={compatibility_score >= 70 ? "default" : compatibility_score >= 40 ? "secondary" : "outline"}
                            className="text-xs"
                        >
                            {compatibility_score >= 70 ? "Excellent Match" :
                                compatibility_score >= 40 ? "Good Match" : "Partial Match"}
                        </Badge>
                    </div>

                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetails?.(job_id)}
                            className="flex items-center space-x-1"
                        >
                            <Eye className="h-4 w-4" />
                            <span>View Details</span>
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => onApply?.(job_id)}
                            className="flex items-center space-x-1"
                        >
                            <Send className="h-4 w-4" />
                            <span>Apply Now</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

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

    if (!jobsData || jobsData.matches.length === 0) {
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
                                We couldn't find any jobs matching your criteria. Try adjusting your search filters.
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
            {/* Header */}
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

            {/* Jobs List */}
            <div className="space-y-4">
                {jobsData.matches.map((job) => (
                    <JobItem
                        key={job.job_id}
                        job={job}
                        userSkills={jobsData.user_skills}
                        onViewDetails={onViewDetails}
                        onApply={onApply}
                        onToggleFavorite={onToggleFavorite}
                    />
                ))}
            </div>

            {/* Load More */}
            {jobsData.total_matches > jobsData.matches.length && (
                <div className="text-center pt-6">
                    <Button variant="outline" size="lg">
                        Load More Jobs
                    </Button>
                </div>
            )}
        </div>
    );
};

