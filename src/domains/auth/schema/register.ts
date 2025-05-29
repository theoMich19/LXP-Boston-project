import z from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Le prénom est requis")
      .min(2, "Le prénom doit contenir au moins 2 caractères")
      .max(50, "Le prénom ne peut pas dépasser 50 caractères")
      .regex(
        /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
        "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"
      ),
    lastName: z
      .string()
      .min(1, "Le nom est requis")
      .min(2, "Le nom doit contenir au moins 2 caractères")
      .max(50, "Le nom ne peut pas dépasser 50 caractères")
      .regex(
        /^[a-zA-ZÀ-ÿ\s\-']{2,}$/,
        "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
      ),
    email: z
      .string()
      .min(1, "L'email est requis")
      .email("Veuillez entrer un email valide")
      .max(100, "L'email ne peut pas dépasser 100 caractères")
      .refine(
        (email) => !email.includes("+"),
        "Les emails avec '+' ne sont pas autorisés"
      ),
    password: z
      .string()
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export const registerSubmitSchema = z.object({
  email: z.string().email(),
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  password: z.string().min(8).max(128),
  role: z.string().min(2).max(50),
  company_id: z.string().min(2).max(50).nullable(),
});
