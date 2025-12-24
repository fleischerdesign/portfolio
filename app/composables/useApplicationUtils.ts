export const useApplicationUtils = () => {
  const statusStyles = {
    applied: {
      chip: 'bg-blue-100 border-blue-200 dark:bg-blue-900/50 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-300',
    },
    interview: {
      chip: 'bg-yellow-100 border-yellow-200 dark:bg-yellow-900/50 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-300',
    },
    offer: {
      chip: 'bg-green-100 border-green-200 dark:bg-green-900/50 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
    },
    rejected: {
      chip: 'bg-red-100 border-red-200 dark:bg-red-900/50 dark:border-red-700',
      text: 'text-red-800 dark:text-red-300',
    },
    withdrawn: {
      chip: 'bg-purple-100 border-purple-200 dark:bg-purple-900/50 dark:border-purple-700',
      text: 'text-purple-800 dark:text-purple-300',
    },
    draft: {
      chip: 'bg-neutral-100 border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700',
      text: 'text-neutral-800 dark:text-neutral-300',
    },
  };

  const getStatusChipClasses = (status: keyof typeof statusStyles) => {
    return statusStyles[status]?.chip || statusStyles.draft.chip;
  }

  const getStatusTextClasses = (status: keyof typeof statusStyles) => {
    return statusStyles[status]?.text || statusStyles.draft.text;
  }

  const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  return {
    getStatusChipClasses,
    getStatusTextClasses,
    formatDate,
  }
}
