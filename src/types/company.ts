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
