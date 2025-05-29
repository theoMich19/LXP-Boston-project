import { useUser } from "@/context/userContext";

export const useAuth = () => {
  const { isAuthenticated, isLoading, user, token } = useUser();

  return {
    isAuthenticated,
    isLoading,
    user,
    token,
  };
};
