export const useApplicationUtils = () => {
  const statusColor = (status: string) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'interview':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'offer':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'rejected':
      case 'withdrawn':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
          case 'draft':
          default:
            return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'    }
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
    statusColor,
    formatDate,
  }
}
