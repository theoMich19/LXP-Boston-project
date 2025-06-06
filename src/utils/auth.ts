import { PasswordRequirement, PasswordStrength } from "@/types/auth";

const PASSWORD_REQUIREMENTS: Omit<PasswordRequirement, "met">[] = [
  { label: "At least 8 characters", minLength: 8 },
  { label: "One lowercase letter (a-z)", regex: /[a-z]/ },
  { label: "One uppercase letter (A-Z)", regex: /[A-Z]/ },
  { label: "One number (0-9)", regex: /\d/ },
  { label: "One special character (!@#$...)", regex: /[!@#$%^&*(),.?":{}|<>]/ },
];

export const getPasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      strength: 0,
      label: "",
      color: "bg-muted",
      requirements: PASSWORD_REQUIREMENTS.map((req) => ({
        ...req,
        met: false,
      })),
    };
  }

  const requirements: PasswordRequirement[] = PASSWORD_REQUIREMENTS.map(
    (req) => ({
      ...req,
      met: req.minLength
        ? password.length >= req.minLength
        : req.regex?.test(password) || false,
    })
  );

  const metRequirements = requirements.filter((req) => req.met).length;
  const strength = (metRequirements / requirements.length) * 100;

  let label: string;
  let color: string;

  if (strength <= 20) {
    label = "Very Weak";
    color = "bg-destructive";
  } else if (strength <= 40) {
    label = "Weak";
    color = "bg-destructive";
  } else if (strength <= 60) {
    label = "Fair";
    color = "bg-warning";
  } else if (strength <= 80) {
    label = "Good";
    color = "bg-primary";
  } else {
    label = "Excellent";
    color = "bg-success";
  }

  return { strength, label, color, requirements };
};
