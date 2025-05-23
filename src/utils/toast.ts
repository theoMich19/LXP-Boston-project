import { toast, ToastOptions, Id } from "react-toastify";

// Configuration par défaut pour tous les toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Options spécifiques pour chaque type de toast
const toastOptions = {
  info: {
    ...defaultOptions,
    type: "info" as const,
    autoClose: 4000,
  },
  success: {
    ...defaultOptions,
    type: "success" as const,
    autoClose: 3000,
  },
  warning: {
    ...defaultOptions,
    type: "warning" as const,
    autoClose: 6000,
  },
  error: {
    ...defaultOptions,
    type: "error" as const,
    autoClose: 8000,
  },
  loading: {
    ...defaultOptions,
    type: "default" as const,
    autoClose: false,
    closeOnClick: false,
    draggable: false,
  },
};

export const toastUtils = {
  // Toast d'information
  info: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.info(message, { ...toastOptions.info, ...options });
  },

  // Toast de succès
  success: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.success(message, { ...toastOptions.success, ...options });
  },

  // Toast d'avertissement
  warn: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.warn(message, { ...toastOptions.warning, ...options });
  },

  // Toast d'erreur
  error: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.error(message, { ...toastOptions.error, ...options });
  },

  // Toast de chargement
  loading: (
    message: string = "Chargement en cours...",
    options?: Partial<ToastOptions>
  ): Id => {
    return toast.loading(message, { ...toastOptions.loading, ...options });
  },

  // Mettre à jour un toast de chargement avec un succès
  updateLoadingToSuccess: (
    toastId: Id,
    message: string,
    options?: Partial<ToastOptions>
  ): void => {
    toast.update(toastId, {
      render: message,
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      draggable: true,
      ...options,
    });
  },

  // Mettre à jour un toast de chargement avec une erreur
  updateLoadingToError: (
    toastId: Id,
    message: string,
    options?: Partial<ToastOptions>
  ): void => {
    toast.update(toastId, {
      render: message,
      type: "error",
      isLoading: false,
      autoClose: 8000,
      closeOnClick: true,
      draggable: true,
      ...options,
    });
  },

  // Fermer un toast spécifique
  dismiss: (toastId?: Id): void => {
    toast.dismiss(toastId);
  },

  // Fermer tous les toasts
  dismissAll: (): void => {
    toast.dismiss();
  },

  // Toast pour les promesses (gère automatiquement loading/success/error)
  promise: <T>(
    promise: Promise<T>,
    messages: {
      pending?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: any) => string);
    },
    options?: Partial<ToastOptions>
  ): Promise<T> => {
    return toast.promise(
      promise,
      {
        pending: messages.pending || "Chargement en cours...",
        success: messages.success || "Opération réussie !",
        error: messages.error || "Une erreur est survenue",
      },
      { ...defaultOptions, ...options }
    );
  },
};

// Fonctions utilitaires pour les cas d'usage courants
export const showApiError = (error: any): Id => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    "Une erreur est survenue";
  return toastUtils.error(message);
};

export const showNetworkError = (): Id => {
  return toastUtils.error(
    "Erreur de connexion. Vérifiez votre connexion internet."
  );
};

export const showValidationError = (
  message: string = "Veuillez vérifier les champs du formulaire"
): Id => {
  return toastUtils.warn(message);
};

export const showSaveSuccess = (entity: string = "élément"): Id => {
  return toastUtils.success(`${entity} sauvegardé avec succès !`);
};

export const showDeleteSuccess = (entity: string = "élément"): Id => {
  return toastUtils.success(`${entity} supprimé avec succès !`);
};

// Export par défaut
export default toastUtils;
