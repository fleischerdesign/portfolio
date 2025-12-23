import { createHash, randomBytes } from 'node:crypto';

export const generateApiKey = () => {
  const prefix = 'sk_';
  const bytes = randomBytes(24);
  const randomString = bytes.toString('hex');
  return prefix + randomString;
};

// Uses SHA256 hashing for API keys
export const hashApiKey = (apiKey: string) => {
  return createHash('sha256').update(apiKey).digest('hex');
};