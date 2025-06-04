import { profileSchema, cvFileSchema } from "@/domains/profile/schema/profile";
import z from "zod";

export type ProfileFormData = z.infer<typeof profileSchema>;
export type CVFile = z.infer<typeof cvFileSchema>;

export interface ProfileData extends ProfileFormData {
  id: string;
  avatar?: string;
  cv?: {
    name: string;
    url: string;
    uploadDate: string;
    size: number;
  };
  profileCompleteness: number;
  joinDate: string;
}

export interface UploadedCV {
  last_upload_date: string;
  file_name: string;
  has_cv: boolean;
}
