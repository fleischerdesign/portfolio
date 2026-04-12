export interface ApplicationDateSource {
  histories?:
    | { status: string; createdAt?: Date | null | undefined }[]
    | null
    | undefined;
  createdAt?: Date | null | undefined;
  updatedAt?: Date | null | undefined;
}

export const useApplicationUtils = () => {
  const statusTextStyles: Record<string, string> = {
    applied: "text-blue-800 dark:text-blue-300",
    interview: "text-yellow-800 dark:text-yellow-300",
    offer: "text-green-800 dark:text-green-300",
    rejected: "text-red-800 dark:text-red-300",
    withdrawn: "text-purple-800 dark:text-purple-300",
    draft: "text-primary-800 dark:text-primary-300",
  };

  const getStatusTextClasses = (status: string) => {
    return statusTextStyles[status] || statusTextStyles.draft;
  };

  const formatDate = (dateString: string | Date | undefined | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const toTime = (d: string | Date | null | undefined) => {
    if (!d) return 0;
    return new Date(d).getTime();
  };

  const getApplicationDate = (
    application: ApplicationDateSource | null | undefined,
  ): string | null => {
    if (!application) return null;
    const sortedHistories = [...(application.histories || [])]
      .filter((h) => h.createdAt)
      .sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));
    const appliedHistory = sortedHistories.find((h) => h.status === "applied");
    return appliedHistory?.createdAt
      ? appliedHistory.createdAt.toString()
      : null;
  };

  const getResponseDate = (
    application: ApplicationDateSource | null | undefined,
  ): string | null => {
    if (!application) return null;
    const sortedHistories = [...(application.histories || [])]
      .filter((h) => h.createdAt)
      .sort((a, b) => toTime(a.createdAt) - toTime(b.createdAt));
    const responseHistory = sortedHistories.find(
      (h) => h.status !== "draft" && h.status !== "applied",
    );
    return responseHistory?.createdAt
      ? responseHistory.createdAt.toString()
      : null;
  };

  const getLastActivityDate = (
    application: ApplicationDateSource | null | undefined,
  ): string | null => {
    if (!application) return null;
    return application.updatedAt ? application.updatedAt.toString() : null;
  };

  const getFormattedApplicationDate = (
    application: ApplicationDateSource | null | undefined,
  ) => {
    const date = getApplicationDate(application);
    return date ? formatDate(date) : "N/A";
  };

  const getFormattedResponseDate = (
    application: ApplicationDateSource | null | undefined,
  ) => {
    const date = getResponseDate(application);
    return date ? formatDate(date) : "N/A";
  };

  const getFormattedLastActivityDate = (
    application: ApplicationDateSource | null | undefined,
  ) => {
    const date = getLastActivityDate(application);
    return date ? formatDate(date) : "N/A";
  };

  const getDisplayDate = (
    application: ApplicationDateSource | null | undefined,
  ) => {
    if (!application) return formatDate(new Date());
    const appDate = getApplicationDate(application);
    if (appDate) return formatDate(appDate);

    // If it's a draft (no applied date), use current date for the document
    return formatDate(new Date());
  };

  const formatForDateTimeLocal = (
    isoString: string | null | undefined,
  ): string => {
    if (!isoString) return "";
    const d = new Date(isoString);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return {
    getStatusTextClasses,
    formatDate,
    getApplicationDate,
    getResponseDate,
    getLastActivityDate,
    getFormattedApplicationDate,
    getFormattedResponseDate,
    getFormattedLastActivityDate,
    getDisplayDate,
    formatForDateTimeLocal,
  };
};
