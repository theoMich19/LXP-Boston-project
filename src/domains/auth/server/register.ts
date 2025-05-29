import { RegisterSubmitData } from "@/types/auth";
import { registerSubmitSchema } from "@/domains/auth/schema/register";

export const registerUser = async (data: RegisterSubmitData) => {
  try {
    const validatedData = registerSubmitSchema.parse(data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      }
    );

    if (!response.ok) {
      let errorMessage = `Erreur HTTP: ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {}

      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    if (error.name === "ZodError") {
      throw new Error(
        "Données invalides: " + error.errors.map((e) => e.message).join(", ")
      );
    }

    // Re-lancer les autres erreurs
    throw error;
  }
};
