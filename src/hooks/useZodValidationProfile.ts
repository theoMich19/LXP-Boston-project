import { cvFileSchema } from "@/domains/profile/schema/profile";
import React, { useState, useCallback } from "react";
import z from "zod";

export const useZodValidation = <T extends z.ZodSchema>(
  schema: T,
  data: z.infer<T>
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    async (field?: keyof z.infer<T>) => {
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
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            const path = err.path.join(".");
            newErrors[path] = err.message;
          });
          setErrors((prev) => ({ ...prev, ...newErrors }));
        }
        return false;
      }
    },
    [schema, data]
  );

  const clearFieldError = useCallback((field: keyof z.infer<T>) => {
    setErrors((prev) => ({ ...prev, [field as string]: "" }));
  }, []);

  const isValid = React.useMemo(() => {
    try {
      schema.parse(data);
      return true;
    } catch {
      return false;
    }
  }, [schema, data]);

  return { errors, validate, clearFieldError, isValid };
};

export const useCVValidation = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const validateFile = useCallback((file: File | null) => {
    if (!file) {
      setErrors([]);
      setIsValid(false);
      return false;
    }

    try {
      cvFileSchema.parse({ file });
      setErrors([]);
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => err.message);
        setErrors(errorMessages);
        setIsValid(false);
      }
      return false;
    }
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setIsValid(false);
  }, []);

  return { errors, isValid, validateFile, clearErrors };
};
