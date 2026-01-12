import type { PublicUser } from '#shared/schemas/user.schema';

export const useProfile = () => {
  const profile = useState<PublicUser | null>('public-profile', () => null);
  const loading = useState<boolean>('public-profile-loading', () => false);

  async function fetchProfile() {
    if (profile.value) return; 

    loading.value = true;
    try {
      const { profile: data } = await $fetch<{ profile: PublicUser }>('/api/profile');
      profile.value = data;
    } catch (error) {
      console.error('Failed to fetch public profile', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    profile,
    loading,
    fetchProfile,
  };
}
