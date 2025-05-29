import z from "zod";

export const profileSchema = z.object({
    firstName: z
        .string()
        .min(1, "Le prénom est requis")
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(50, "Le prénom ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s\-']{2,}$/, "Le prénom ne peut contenir que des lettres"),
    lastName: z
        .string()
        .min(1, "Le nom est requis")
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s\-']{2,}$/, "Le nom ne peut contenir que des lettres"),
    email: z
        .string()
        .min(1, "L'email est requis")
        .email("Veuillez entrer un email valide")
        .max(100, "L'email ne peut pas dépasser 100 caractères"),
});

export const cvFileSchema = z.object({
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size <= 5 * 1024 * 1024,
            "Le fichier ne peut pas dépasser 5MB"
        )
        .refine(
            (file) => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'].includes(file.type),
            "Seuls les fichiers PDF et DOCX sont autorisés"
        )
});
