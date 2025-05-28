import { useState, useCallback, useMemo } from "react";
import z from "zod";

export const useZodValidation = <T extends z.ZodSchema>(
  schema: T,
  data: z.infer<T>
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback(
    async (field?: keyof z.infer<T>) => {
      setIsValidating(true);

      try {
        if (field) {
          const fieldSchema = schema.shape[field as string];
          if (fieldSchema) {
            await fieldSchema.parseAsync(data[field]);
            setErrors((prev) => ({ ...prev, [field as string]: "" }));
          }
        } else {
          await schema.parseAsync(data);
          setErrors({});
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            newErrors[path] = err.message;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        }
      } finally {
        setIsValidating(false);
      }
    },
    [schema, data]
  );

  const validateField = useCallback(
    async (field: keyof z.infer<T>) => {
      await validate(field);
    },
    [validate]
  );

  const validateAll = useCallback(async () => {
    await validate();
  }, [validate]);

  const clearFieldError = useCallback((field: keyof z.infer<T>) => {
    setErrors((prev) => ({ ...prev, [field as string]: "" }));
  }, []);

  const isValid = useMemo(() => {
    try {
      schema.parse(data);
      return true;
    } catch {
      return false;
    }
  }, [schema, data]);

  return {
    errors,
    isValidating,
    validateField,
    validateAll,
    clearFieldError,
    isValid,
  };
};
