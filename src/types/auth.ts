import { loginSchema } from "@/domains/auth/schema/login";
import {
  registerSchema,
  registerSubmitSchema,
} from "@/domains/auth/schema/register";
import z from "zod";

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  className?: string;
}

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  className?: string;
}

export interface AuthPageProps {
  initialView?: "login" | "register";
}

export interface PasswordRequirement {
  label: string;
  met: boolean;
  regex?: RegExp;
  minLength?: number;
}

export interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
  requirements: PasswordRequirement[];
}

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginSubmitData = LoginFormData;
export type RegisterSubmitData = z.infer<typeof registerSubmitSchema>;

export interface LoginSubmitDataExplicit {
  email: string;
  password: string;
}

export interface RegisterSubmitDataExplicit {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}
