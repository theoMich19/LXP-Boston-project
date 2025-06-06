import { toast, ToastOptions, Id } from "react-toastify";

// Default configuration for all toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

// Specific options for each type of toast
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
  // Info toast
  info: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.info(message, { ...toastOptions.info, ...options });
  },

  // Success toast
  success: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.success(message, { ...toastOptions.success, ...options });
  },

  // Warning toast
  warn: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.warn(message, { ...toastOptions.warning, ...options });
  },

  // Error toast
  error: (message: string, options?: Partial<ToastOptions>): Id => {
    return toast.error(message, { ...toastOptions.error, ...options });
  },

  // Loading toast
  loading: (
    message: string = "Loading...",
    options?: Partial<ToastOptions>
  ): Id => {
    return toast.loading(message, { ...toastOptions.loading, ...options });
  },

  // Update loading toast with success
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

  // Update loading toast with error
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

  // Close a specific toast
  dismiss: (toastId?: Id): void => {
    toast.dismiss(toastId);
  },

  // Close all toasts
  dismissAll: (): void => {
    toast.dismiss();
  },

  // Toast for promises (automatically handles loading/success/error)
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
        pending: messages.pending || "Loading...",
        success: messages.success || "Operation successful!",
        error: messages.error || "An error occurred",
      },
      { ...defaultOptions, ...options }
    );
  },
};

// Utility functions for common use cases
export const showApiError = (error: any): Id => {
  const message =
    error?.response?.data?.message || error?.message || "An error occurred";
  return toastUtils.error(message);
};

export const showNetworkError = (): Id => {
  return toastUtils.error(
    "Connection error. Please check your internet connection."
  );
};

export const showValidationError = (
  message: string = "Please check the form fields"
): Id => {
  return toastUtils.warn(message);
};

export const showSaveSuccess = (entity: string = "item"): Id => {
  return toastUtils.success(`${entity} saved successfully!`);
};

export const showDeleteSuccess = (entity: string = "item"): Id => {
  return toastUtils.success(`${entity} deleted successfully!`);
};

// Default export
export default toastUtils;
