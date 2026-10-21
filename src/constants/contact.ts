export const NAME_MIN_LENGTH = 7;
export const NAME_MAX_LENGTH = 60;

export const MESSAGE_MIN_LENGTH = 10;
export const MESSAGE_MAX_LENGTH = 300;

export const EMAIL_MIN_LENGTH = 6;
export const EMAIL_MAX_LENGTH = 255;

export const RATE_LIMIT = {
  requests: 3,
  window: "10 m",
} as const;

