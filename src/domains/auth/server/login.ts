import { LoginFormData } from "@/types/auth";
import { loginSchema } from "@/domains/auth/schema/login";

export const loginUser = async (data: LoginFormData) => {
  try {
    const validatedData = loginSchema.parse(data);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/login`,
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

    throw error;
  }
};
