"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { useUser } from '@/context/userContext';
import { ProfileFormData, UploadedCV } from '@/types/profile';
import { PersonalInfoForm } from '@/domains/profile/form/form-personnel';
import ProfileRecapCard from '@/components/profile/profile-recap-card';
import { ProfileCompletudeCard } from '@/components/profile/profile-completude-card';
import { CVUploadForm } from '@/domains/profile/form/form-cv';
import { CVEmptyCard, CVExistingCard, CVLoadingSkeleton } from '@/components/profile/profile-cv-card';
import { ApplyJob } from '@/components/profile/profile-applyJob-list';
import { CompanyInfoCard } from '@/components/profile/profile-company-info';
import { JobDetailsModal } from '@/components/jobs/job-modals';
import { JobMatch } from '@/types/jobs';
import { CompaniesResponse, Company, CompanyData } from '@/types/company';
import { ApplicationsModal } from '@/components/profile/profile-apply-job-modal';
import { CreateJobModal } from '@/components/profile/profile-job-create-modal';

const ProfilePage = () => {
    const { user, isAuthenticated, updateUser } = useUser();
    const [formData, setFormData] = useState<ProfileFormData>({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
    });
    const [lastCVData, setLastCVData] = useState<UploadedCV | null>(null)
    const [dataCompanyUser, setDataCompanyUser] = useState<CompanyData | null>(null)
    const [dataCandidateApply, setDataCandidateApply] = useState<null>(null)
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingCVData, setIsLoadingCVData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: 'success' | 'error' | 'info' | 'warning';
        message: string;
    } | null>(null);
    const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors] = useState<Record<string, string>>({});
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isModalApplyOpen, setIsModalApplyOpen] = useState<boolean>(false);
    const [isModalJobOpen, setIsModalJobOpen] = useState<boolean>(false);

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/companies/`);
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            const data: CompaniesResponse = await response.json();
            setCompanies(data.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
        }
    }, []);

    const handleInputChange = useCallback((field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSaveProfile = useCallback(async () => {
        setIsLoading(true);
        setAlert(null);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication token missing. Please log in.');
            }

            if (!user?.id) {
                throw new Error('User ID missing.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/candidates/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: formData.first_name.trim(),
                    last_name: formData.last_name.trim(),
                    email: formData.email.trim().toLowerCase()
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Unauthorized access to this feature.');
                }
                if (response.status === 404) {
                    throw new Error('User profile not found.');
                }
                if (response.status === 400) {
                    const errorData = await response.json().catch(() => null);
                    throw new Error(errorData?.message || 'Invalid data.');
                }

                throw new Error(`HTTP Error: ${response.status}`);
            }

            const updatedUserData = await response.json();

            // 🎯 UPDATE CONTEXT
            updateUser({
                first_name: updatedUserData.first_name || formData.first_name,
                last_name: updatedUserData.last_name || formData.last_name,
                email: updatedUserData.email || formData.email
            });

            setIsEditing(false);
            setAlert({
                type: 'success',
                message: 'Profile updated successfully!'
            });

        } catch (error) {
            console.error('Error updating profile:', error);

            setAlert({
                type: 'error',
                message: error instanceof Error ? error.message : 'Error updating profile'
            });
        } finally {
            setIsLoading(false);
        }
    }, [formData, user?.id, updateUser]);

    const handleCancelEdit = useCallback(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            });
        }
        setIsEditing(false);
        setAlert(null);
    }, [user]);

    const fetchLastCVData = async () => {
        setIsLoadingCVData(true);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication token missing. Please log in.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/cvs/last-upload`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Unauthorized access to this feature.');
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            setLastCVData(data);

        } catch (err) {
            console.error('Error fetching CV:', err);
        } finally {
            setIsLoadingCVData(false);
        }
    };

    const fetchDataCompanyApply = async () => {
        setIsLoadingCVData(true);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication token missing. Please log in.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/companies/${user?.company_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Unauthorized access to this feature.');
                }
            }

            const data = await response.json();
            setDataCompanyUser(data)
        } catch (err) {
            console.error('Error fetching company data:', err);

        } finally {
            setIsLoadingCVData(false);
        }
    };

    const fetchCandidateApply = async (job_offer_id: number) => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication token missing. Please log in.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/job/${job_offer_id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Unauthorized access to this feature.');
                }
            }

            const data = await response.json();
            setDataCandidateApply(data)
        } catch (err) {
            console.error('Error fetching candidate applications:', err);

        }
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedJob(null);
    };

    const handleViewJob = (jobId: number) => {
        const job = dataCompanyUser?.job_offers.find(j => j.id === jobId);
        if (job) {
            const jobData = {
                id: job.id,
                title: job.title,
                description: job.description || 'No description available',
                company_id: user?.company_id || 1,
                salary_min: job.salary_min || '0',
                salary_max: job.salary_max || '0',
                status: job.status || 'active',
                created_at: job.created_at || new Date().toISOString()
            } as JobMatch;

            setSelectedJob(jobData);
            setIsModalOpen(true);
        }
    };

    const handleViewCandidateApplyJob = (job_offer_id: number) => {
        fetchCandidateApply(job_offer_id)
        setIsModalApplyOpen(true)
    }

    const handleJobCreated = (newJob: any) => {
        if (user) {
            if (user?.role === "hr") {
                fetchDataCompanyApply()
                fetchCompanies()
            } else if (user.role === "candidate") {
                fetchLastCVData()
            }
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            });
            if (user?.role === "hr") {
                fetchDataCompanyApply()
                fetchCompanies()
            } else if (user.role === "candidate") {
                fetchLastCVData()
            }
        }
    }, [user]);

    const handleStatusUpdate = async (applicationId: number, newStatus: 'accepted' | 'rejected' | 'pending') => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Authentication token missing. Please log in.');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications/${applicationId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expired. Please log in again.');
                }
                if (response.status === 403) {
                    throw new Error('Unauthorized access to this feature.');
                }
                if (response.status === 404) {
                    throw new Error('Application not found.');
                }
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            // Update local application state
            setDataCandidateApply(prev =>
                prev.map(app =>
                    app.id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            // Optional: display success message

            return data;

        } catch (err) {
            console.error('Error updating status:', err);
            throw err; // Re-throw so the component can handle the error
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5 flex items-center justify-center">
                <Card className="p-8 text-center">
                    <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading profile...</p>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-background to-accent/5">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    {alert && (
                        <div className="mb-6">
                            <Alert
                                title={
                                    alert.type === 'success' ? 'Success' :
                                        alert.type === 'error' ? 'Error' :
                                            alert.type === 'warning' ? 'Warning' : 'Information'
                                }
                                className={`${alert.type === 'success' ? 'border-success bg-success/10' :
                                    alert.type === 'error' ? 'border-destructive bg-destructive/10' :
                                        alert.type === 'warning' ? 'border-warning bg-warning/10' :
                                            'border-primary bg-primary/10'
                                    } animate-fade-in`}
                            >
                                {alert.message}
                            </Alert>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="space-y-6">
                            <ProfileRecapCard user={user} />
                            <ProfileCompletudeCard user={user} />
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <PersonalInfoForm
                                formData={formData}
                                isEditing={isEditing}
                                isLoading={isLoading}
                                errors={errors}
                                onInputChange={handleInputChange}
                                onEdit={() => setIsEditing(true)}
                                onCancel={handleCancelEdit}
                                onSave={handleSaveProfile}
                            />
                            {
                                user.role === "hr" && dataCompanyUser ? (
                                    <>
                                        <CompanyInfoCard companyData={dataCompanyUser} />
                                        <ApplyJob
                                            companyData={dataCompanyUser}
                                            setIsModalJobOpen={setIsModalJobOpen}
                                            handleViewJob={handleViewJob}
                                            handleViewCandidateApplyJob={handleViewCandidateApplyJob} />
                                    </>
                                ) : null}

                            {
                                user.role === "candidate" ? (
                                    <>
                                        {
                                            isLoadingCVData ? (
                                                <CVLoadingSkeleton />
                                            ) : (
                                                <> {
                                                    lastCVData?.has_cv ? (
                                                        <CVExistingCard lastUploadDate={lastCVData.last_upload_date} />
                                                    ) : (
                                                        <CVEmptyCard />
                                                    )
                                                }
                                                </>
                                            )
                                        }
                                        <CVUploadForm fetchLastCVData={fetchLastCVData} />
                                    </>
                                ) : (null)
                            }
                        </div>
                    </div>
                </div>
            </div>
            <JobDetailsModal
                job={selectedJob}
                companies={companies}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
            <ApplicationsModal
                isOpen={isModalApplyOpen}
                onClose={() => setIsModalApplyOpen(false)}
                applications={dataCandidateApply ? dataCandidateApply : []}
                jobTitle="Frontend React Developer Senior"
                onStatusUpdate={handleStatusUpdate}
            />

            <CreateJobModal
                isOpen={isModalJobOpen}
                onClose={() => setIsModalJobOpen(false)}
                onJobCreated={handleJobCreated}
            />
        </>
    );
};

export default ProfilePage;