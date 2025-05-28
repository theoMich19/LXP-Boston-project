import { loginSchema, registerSchema } from "@/domains/auth/schema/schema";
import z from "zod";

export interface LoginFormProps {
  onSwitchToRegister: () => void;
  isLoading: boolean;
  onSubmit: (data: LoginFormData) => void | Promise<void>;
  className?: string;
}

export interface RegisterFormProps {
  onSwitchToLogin: () => void;
  isLoading: boolean;
  onSubmit: (data: RegisterSubmitData) => void | Promise<void>;
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
export type RegisterSubmitData = Omit<
  RegisterFormData,
  "confirmPassword" | "acceptTerms"
>;
