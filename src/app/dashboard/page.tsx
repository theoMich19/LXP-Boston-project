"use client"
import { JobsList } from '@/components/jobs/jobs-list';
import { FormSearch } from '@/domains/search/form/form-search';

export default function Home() {
  const mockJobsData = {
    matches: [
      {
        job_id: 3,
        title: "Full-Stack Developer JavaScript",
        company_name: "StartupInc",
        company_id: 2,
        compatibility_score: 36,
        matched_skills: ["javascript", "node.js", "express"],
        missing_skills: ["git", "typescript", "postgresql", "jira", "aws"],
        salary_min: "42000.00",
        salary_max: "55000.00",
        description_preview: "Startup en forte croissance recherche un développeur Full-Stack passionné pour développer notre plateforme SaaS."
      },
      {
        job_id: 8,
        title: "Senior Software Engineer (Remote)",
        company_name: "CloudFirst",
        company_id: 5,
        compatibility_score: 13,
        matched_skills: ["javascript", "mongodb"],
        missing_skills: ["gcp", "azure", "typescript", "git", "kubernetes"],
        salary_min: "65000.00",
        salary_max: "85000.00",
        description_preview: "Poste 100% remote pour développeur expérimenté dans une entreprise internationale. What you'll do: Design and implement scalable software solutions..."
      }
    ],
    total_matches: 2,
    user_skills: ["javascript", "angular", "express", "node.js", "mongodb", "api"],
    message: "Found 2 job matches based on your CV analysis."
  };

  const handleViewDetails = (jobId: number) => {
    console.log('View details for job:', jobId);
  };

  const handleApply = (jobId: number) => {
    console.log('Apply to job:', jobId);
  };

  const handleToggleFavorite = (jobId: number) => {
    console.log('Toggle favorite for job:', jobId);
  };

  return (
    <div className="py-4 space-y-4 container mx-auto">
      <FormSearch />
      <JobsList
        jobsData={mockJobsData}
        onViewDetails={handleViewDetails}
        onApply={handleApply}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};
