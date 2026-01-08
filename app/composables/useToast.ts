export interface ToastOptions {
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number; // Duration in ms. 0 for persistent.
  dismissible?: boolean;
}

type AddToastFunction = (message: string, options?: ToastOptions) => void;

// This state will hold the function that adds a toast.
const useToastContainerState = () => useState<AddToastFunction | null>('toast-container-add-fn', () => null);

// Shows a toast notification from any component or composable.
export const useToast = () => {
  const showToast = (message: string, options?: ToastOptions) => {
    const addToast = useToastContainerState().value;
    if (!addToast) {
      console.warn('Toast container not found. Ensure <UiToastContainer /> is in your app.');
      return;
    }
    addToast(message, options);
  };

  return {
    showToast,
  };
};

// Internal use by the ToastContainer to register its addToast method.
export const registerToastContainer = (addToast: AddToastFunction) => {
  useToastContainerState().value = addToast;
};