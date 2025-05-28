import { PasswordRequirement, PasswordStrength } from "@/types/auth";

const PASSWORD_REQUIREMENTS: Omit<PasswordRequirement, "met">[] = [
  { label: "Au moins 8 caractères", minLength: 8 },
  { label: "Une minuscule (a-z)", regex: /[a-z]/ },
  { label: "Une majuscule (A-Z)", regex: /[A-Z]/ },
  { label: "Un chiffre (0-9)", regex: /\d/ },
  { label: "Un caractère spécial (!@#$...)", regex: /[!@#$%^&*(),.?":{}|<>]/ },
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
    label = "Très faible";
    color = "bg-destructive";
  } else if (strength <= 40) {
    label = "Faible";
    color = "bg-destructive";
  } else if (strength <= 60) {
    label = "Moyen";
    color = "bg-warning";
  } else if (strength <= 80) {
    label = "Bon";
    color = "bg-primary";
  } else {
    label = "Excellent";
    color = "bg-success";
  }

  return { strength, label, color, requirements };
};
