import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Veuillez entrer un email valide")
    .max(100, "L'email ne peut pas dépasser 100 caractères"),
  password: z
    .string()
    .min(1, "Le mot de passe est requis")
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .max(128, "Le mot de passe ne peut pas dépasser 128 caractères"),
});
