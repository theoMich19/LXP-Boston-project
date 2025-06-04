"use client"
import { useState, useEffect } from 'react';
import { JobsList } from '@/components/jobs/jobs-list';
import { FormSearch } from '@/domains/jobs/form/form-search';
import { JobsApiResponse } from '@/types/jobs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Target } from 'lucide-react';

export default function Home() {
  const [jobsData, setJobsData] = useState<JobsApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingIA, setIsLoadingIA] = useState(false);
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
      setJobsData(data);

    } catch (err) {
      console.error('Erreur lors du fetch des jobs:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');

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
        throw new Error('Token d\'authentification manquant. Veuillez vous connecter.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/matches/?limit=10`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Gestion spécifique des erreurs d'authentification
        if (response.status === 401) {
          throw new Error('Session expirée. Veuillez vous reconnecter.');
        }
        if (response.status === 403) {
          throw new Error('Accès non autorisé à cette fonctionnalité.');
        }
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data: JobsApiResponse = await response.json();
      setJobsData(data);

    } catch (err) {
      console.error('Erreur lors du fetch des jobs IA:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');

    } finally {
      setIsLoadingIA(false);
    }
  };
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleViewDetails = (jobId: number) => {
    // TODO: Navigation vers la page de détail du job
    // router.push(`/jobs/${jobId}`);
  };

  const handleApply = (jobId: number) => {
    // TODO: Logique de candidature
  };

  const handleToggleFavorite = (jobId: number) => {
    // TODO: Appel API pour ajouter/supprimer des favoris
  };

  if (isLoading) {
    return (
      <div className="py-4 space-y-4 container mx-auto">
        {/* <FormSearch /> */}
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Chargement des offres d'emploi...</span>
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
            ⚠️ Connexion à l'API impossible - Affichage des données de test
          </p>
        </div>
      )}

      {/* <div className="w-full">
        <FormSearch />
      </div> */}

      {/* Layout principal avec sidebar */}
      <div className="flex gap-6">
        {/* Colonne principale - Liste des jobs */}
        <div className="flex-1">
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
              <p className="text-muted-foreground">Aucune offre d'emploi trouvée.</p>
              <button
                onClick={fetchJobs}
                className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              >
                Actualiser
              </button>
            </div>
          )}
        </div>

        {/* Sidebar droite - Recherche IA et autres widgets */}
        <div className="w-80 space-y-6">
          {/* Card principale - Recherche IA */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Trouve ton job idéal
                </h3>
                <p className="text-muted-foreground text-sm">
                  Notre IA analyse ton profil pour te proposer les offres qui te correspondent le mieux
                </p>
              </div>

              <Button
                onClick={fetchJobsIA}
                disabled={isLoadingIA}
                className="w-full"
                size="lg"
              >
                {isLoadingIA ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Target className="h-4 w-4 mr-2" />
                    Chercher avec l'IA
                  </>
                )}
              </Button>

              {/* Statistiques ou features */}
              <div className="pt-4 border-t border-primary/10">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-xs text-muted-foreground">Précision</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">3x</div>
                    <div className="text-xs text-muted-foreground">Plus rapide</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}