import { profileSchema, cvFileSchema } from "@/domains/profile/schema/schema";
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

export interface ProfilePageProps {
  initialData?: ProfileData;
  onProfileUpdate?: (data: ProfileFormData) => Promise<void>;
  onCVUpload?: (file: File) => Promise<string>;
  onCVDelete?: () => Promise<void>;
  onAvatarUpload?: (file: File) => Promise<string>;
}
