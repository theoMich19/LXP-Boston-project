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
import { Company } from '@/types/company';

interface JobDetailsModalProps {
    job: JobMatch | null;
    companies: Company[];
    isOpen: boolean;
    onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
    job,
    isOpen,
    onClose,
    companies
}) => {
    if (!isOpen || !job) return null;

    const getCompanyData = (company_id: number) => {
        const data = companies.find(company => company.id === company_id)
        return data
    }
    const company = getCompanyData(job.company_id)

    const formatSalary = (min: number, max: number) => {
        const minK = Math.round(min / 1000);
        const maxK = Math.round(max / 1000);
        return `${minK}k - ${maxK}k €`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const jobDate = new Date(dateString);
        const diffInDays = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        return `${diffInDays} days ago`;
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
                                <span className="text-lg font-medium">{company?.name}</span>
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
                                    {job.status === 'active' ? 'Active' : job.status}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Published on {formatDate(job?.created_at)}
                                </span>
                            </div>
                        </div>

                        {/* Job Description */}
                        <div>
                            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
                                <Info className="h-5 w-5 mr-2" />
                                Job Description
                            </h2>
                            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed bg-muted/20 rounded-lg p-4">
                                {formatDescription(job.description)}
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="bg-muted/30 rounded-lg p-4">
                            <h3 className="font-semibold text-foreground mb-3 flex items-center">
                                <Building className="h-5 w-5 mr-2" />
                                Company Information
                            </h3>
                            <div className="flex items-center space-x-3">
                                <Avatar />
                                <div>
                                    <p className="font-medium text-foreground">{company.name}</p>
                                    <p className="text-sm text-muted-foreground">Company ID: {job.company_id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Job Details Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center">
                                    <DollarSign className="h-5 w-5 mr-2" />
                                    Job Details
                                </h3>
                                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Salary:</span>
                                        <span className="font-medium">{formatSalary(job.salary_min, job.salary_max)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Contract Type:</span>
                                        <span className="font-medium">Full-time</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Location:</span>
                                        <span className="font-medium">Remote / Hybrid</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Experience Level:</span>
                                        <span className="font-medium">2-5 years experience</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground flex items-center">
                                    <Info className="h-5 w-5 mr-2" />
                                    General Information
                                </h3>
                                <div className="bg-muted/20 rounded-lg p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Job ID:</span>
                                        <span className="font-mono font-medium">#{job.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant="outline" className="text-xs">
                                            {job.status === 'active' ? 'Active' : job.status}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Publication Date:</span>
                                        <span className="font-medium">{getTimeAgo(job.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Full Date:</span>
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