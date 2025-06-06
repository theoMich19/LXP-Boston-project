import { JobMatch } from "./jobs";

export interface CompanyData {
  id: number;
  name: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
  job_offers: JobMatch[];
  message: string;
}

export interface Company {
  id: number;
  name: string;
  city: string;
  country: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface CompaniesResponse {
  total: number;
  data: Company[];
  message: string;
}
