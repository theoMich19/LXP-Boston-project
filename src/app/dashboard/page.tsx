"use client"
import { useState, useEffect } from 'react';
import { JobsList } from '@/components/jobs/jobs-list';
import { FormSearch } from '@/domains/jobs/form/form-search';
import { JobsApiResponse } from '@/types/jobs';

export default function Home() {
  const [jobsData, setJobsData] = useState<JobsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: JobsApiResponse = await response.json();
      console.log("🚀 ~ fetchJobs ~ data:", data)
      setJobsData(data);

    } catch (err) {
      console.error('Erreur lors du fetch des jobs:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewDetails = (jobId: number) => {
    console.log('View details for job:', jobId);
    // TODO: Navigation vers la page de détail du job
    // router.push(`/jobs/${jobId}`);
  };

  const handleApply = (jobId: number) => {
    console.log('Apply to job:', jobId);
    // TODO: Logique de candidature
  };

  const handleToggleFavorite = (jobId: number) => {
    console.log('Toggle favorite for job:', jobId);
    // TODO: Appel API pour ajouter/supprimer des favoris
  };

  // const handleSearch = () => {
  //   fetchJobs();
  // };

  if (isLoading) {
    return (
      <div className="py-4 space-y-4 container mx-auto">
        <FormSearch />
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Chargement des offres d&apos;emploi...</span>
        </div>
      </div>
    );
  }

  if (error && !jobsData) {
    return (
      <div className="py-4 space-y-4 container mx-auto">
        <FormSearch />
        <div className="text-center py-12">
          <div className="text-destructive mb-4">
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={fetchJobs}
            className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 space-y-4 container mx-auto">
      {error && (
        <div className="bg-warning/10 border border-warning rounded-lg p-4 text-center">
          <p className="text-warning text-sm">
            ⚠️ Connexion à l&apos;API impossible - Affichage des données de test
          </p>
        </div>
      )}

      {/* <FormSearch onSearch={handleSearch} /> */}

      {jobsData && (
        <JobsList
          jobsData={jobsData}
          onViewDetails={handleViewDetails}
          onApply={handleApply}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {jobsData && jobsData.data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune offre d&apos;emploi trouvée.</p>
          <button
            onClick={fetchJobs}
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          >
            Actualiser
          </button>
        </div>
      )}
    </div>
  );
}
