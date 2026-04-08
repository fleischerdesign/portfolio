export const APPLICATION_STATUS = [
  "draft",
  "applied",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUS)[number];

export const isApplicationStatus = (val: string): val is ApplicationStatus =>
  APPLICATION_STATUS.includes(val as ApplicationStatus);
