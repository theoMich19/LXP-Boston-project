"use client"
import { useState, useEffect, useCallback } from 'react';
import { JobsList } from '@/components/jobs/jobs-list';
import { FormSearch } from '@/domains/jobs/form/form-search';
import { JobMatch, JobsApiResponse, JobMatchApply } from '@/types/jobs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Target } from 'lucide-react';
import { useUser } from '@/context/userContext';
import { JobDetailsModal } from '@/components/jobs/job-modals';
import { CompaniesResponse, Company } from '@/types/company';
import { UploadedCV } from '@/types/profile';

export default function Home() {
  const { user } = useUser()
  const [jobsData, setJobsData] = useState<JobsApiResponse | null>(null);
  const [dataJobsApply, setDataJobsApply] = useState<JobMatchApply[] | []>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingIA, setIsLoadingIA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [lastCVData, setLastCVData] = useState<UploadedCV | null>(null)

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/jobs/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: JobsApiResponse = await response.json();
      setJobsData(data);

    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');

    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobsIA = async () => {
    setIsLoadingIA(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token missing. Please log in.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/matches/?limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Specific handling of authentication errors
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('Unauthorized access to this feature.');
        }
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data: JobsApiResponse = await response.json();
      setJobsData(data);

    } catch (err) {
      console.error('Error fetching AI jobs:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');

    } finally {
      setIsLoadingIA(false);
    }
  };

  useEffect(() => {
    fetchCompanies()
    fetchJobs();
  }, []);

  useEffect(() => {
    getJobsApply()
  }, [jobsData]);

  useEffect(() => {
    fetchLastCVData()
  }, [user])

  const fetchLastCVData = async () => {
    if (!user || user?.role === "hr") return

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
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleViewDetails = (jobId: number) => {
    const job = jobsData?.data.find(j => j.id === jobId);
    if (job) {

      const jobData = {
        id: job.id,
        title: job.title,
        description: job.description || 'No description available',
        company_id: job.company_id || 1,
        salary_min: job.salary_min || '0',
        salary_max: job.salary_max || '0',
        status: job.status || 'active',
        created_at: job.created_at || new Date().toISOString()
      } as JobMatch;

      setSelectedJob(jobData);
      setIsModalOpen(true);
    }
  };

  const handleApply = (jobId: number) => {
    const applyToJob = async (jobId: number): Promise<void> => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication token missing. Please log in.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            job_offer_id: jobId
          }),
        });

        if (!response.ok) {
          // Specific handling of authentication errors
          if (response.status === 401) {
            throw new Error('Session expired. Please log in again.');
          }
          if (response.status === 403) {
            throw new Error('Unauthorized access to this feature.');
          }
          if (response.status === 409) {
            throw new Error('You have already applied to this position.');
          }
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (jobsData) {
          const updatedJobsData: JobsApiResponse = {
            ...jobsData,
            data: jobsData.data.filter(job => job.id !== jobId),
            total_matches: jobsData.total_matches - 1
          };
          setJobsData(updatedJobsData);
        }

        return data;
      } catch (error) {
        console.error('Error during application:', error);
        throw error;
      }
    };

    applyToJob(jobId)
  };

  const getJobsApply = async () => {
    if (user && user?.role === "candidate") {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('Authentication token missing. Please log in.');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Specific handling of authentication errors
          if (response.status === 401) {
            throw new Error('Session expired. Please log in again.');
          }
          if (response.status === 403) {
            throw new Error('Unauthorized access to this feature.');
          }
          if (response.status === 409) {
            throw new Error('You have already applied to this position.');
          }
          throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        setDataJobsApply(data)
        return data;
      } catch (error) {
        console.error('Error during application:', error);
        throw error;
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="py-4 space-y-4 container mx-auto">
        {/* <FormSearch /> */}
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading job offers...</span>
        </div>
      </div>
    );
  }

  if (error && !jobsData) {
    return (
      <div className="py-4 space-y-4 container mx-auto">
        {/* <FormSearch /> */}
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <p className="font-semibold">Loading Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchJobs}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="py-4 space-y-4 container mx-auto">
        {error && (
          <div className="bg-warning/10 border border-warning rounded-lg p-4 text-center">
            <p className="text-warning text-sm">
              ⚠️ Unable to connect to API - Displaying test data
            </p>
          </div>
        )}

        <div className="flex gap-6">
          <div className="flex-1">
            {jobsData && (
              <JobsList
                dataJobsApply={dataJobsApply}
                jobsData={jobsData}
                onViewDetails={handleViewDetails}
                onApply={handleApply}
                companies={companies}
              />
            )}

            {jobsData && jobsData.data.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No job offers found.</p>
                <button
                  onClick={fetchJobs}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                >
                  Refresh
                </button>
              </div>
            )}
          </div>

          {user?.role === "candidate" ? (
            <div className="w-80 space-y-6">
              {/* Main Card - AI Search */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Find your ideal job
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Our AI analyzes your profile to suggest the jobs that match you best
                    </p>
                  </div>

                  <Button
                    onClick={fetchJobsIA}
                    disabled={isLoadingIA || !lastCVData?.has_cv}
                    className="w-full"
                    size="lg"
                  >
                    {isLoadingIA ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Search with AI
                      </>
                    )}
                  </Button>
                  {
                    !lastCVData?.has_cv ?
                      <p className="text-muted-foreground text-sm">
                        No CV saved, please add one from your profile
                      </p> : null
                  }

                  {/* Statistics or features */}
                  <div className="pt-4 border-t border-primary/10">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary">95%</div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-success">3x</div>
                        <div className="text-xs text-muted-foreground">Faster</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </div>
      </div>

      <JobDetailsModal
        job={selectedJob}
        companies={companies}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}