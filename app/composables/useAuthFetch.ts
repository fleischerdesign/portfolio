import type { UseFetchOptions } from 'nuxt/app';

export const useAuthFetch = <T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) => {
  const key = options.key || (typeof url === 'string' ? url : JSON.stringify(options));

  return useAsyncData<T>(key, () =>
    useRequestFetch()(url, {
      ...options,
    })
  );
};
