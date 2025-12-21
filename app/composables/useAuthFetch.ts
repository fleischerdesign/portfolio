import type { UseFetchOptions } from 'nuxt/app';

/**
 * A custom composable that wraps useAsyncData and useRequestFetch
 * to provide a convenient, authenticated fetch function.
 * It mimics the API of useFetch.
 */
export const useAuthFetch = <T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) => {
  // Automatically generate a key for useAsyncData if not provided
  const key = options.key || (typeof url === 'string' ? url : JSON.stringify(options));
  
  return useAsyncData<T>(key, () =>
    // useRequestFetch() creates a pre-configured $fetch instance
    // that includes authentication cookies for server-side requests.
    useRequestFetch()(url, {
      ...options,
    })
  );
};
