export const CONTENT_STATUS = ["draft", "published", "archived"] as const;

export type ContentStatus = (typeof CONTENT_STATUS)[number];

export const isContentStatus = (val: string): val is ContentStatus =>
  CONTENT_STATUS.includes(val as ContentStatus);
