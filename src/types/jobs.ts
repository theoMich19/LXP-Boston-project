import { Company } from "./company";

export interface JobMatch {
  id: number;
  title: string;
  company_name: string;
  company_id: number;
  compatibility_score?: number;
  matched_skills?: string[];
  missing_skills?: string[];
  salary_min: number;
  salary_max: number;
  description: string;
  status?: string;
  created_at?: string;
}
export interface JobMatchApply {
  applied_at: string;
  candidate_email: string;
  candidate_first_name: string;
  candidate_last_name: string;
  company_name: string;
  id: number;
  job_offer_id: number;
  job_salary_max: number;
  job_salary_min: number;
  job_title: string;
  status: string;
  user_id: number;
}

export interface JobsData {
  data: JobMatch[];
  total_matches: number;
  user_skills: string[];
  message: string;
}

export interface JobItemProps {
  isJobsApply: boolean;
  job: JobMatch;
  userSkills: string[];
  onViewDetails?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
  company: Company;
}

export interface ListJobsProps {
  dataJobsApply: JobMatchApply[];
  jobsData?: JobsData;
  loading?: boolean;
  onViewDetails?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
  companies: Company[];
}

export interface JobsApiResponse {
  data: JobMatch[];
  total_matches: number;
  user_skills: string[];
  message: string;
}
