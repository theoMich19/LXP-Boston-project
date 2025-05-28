export interface JobMatch {
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

export interface JobsData {
  matches: JobMatch[];
  total_matches: number;
  user_skills: string[];
  message: string;
}

export interface JobItemProps {
  job: JobMatch;
  userSkills: string[];
  onViewDetails?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
  onToggleFavorite?: (jobId: number) => void;
}

export interface ListJobsProps {
  jobsData?: JobsData;
  loading?: boolean;
  onViewDetails?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
  onToggleFavorite?: (jobId: number) => void;
}
