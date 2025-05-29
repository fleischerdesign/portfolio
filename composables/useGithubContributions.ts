type Contribution = {
  date: string;
  count: number;
}

export const useGitHubContributions = () => {
  const contributions = useState<Contribution[]>('contributions', () => []);

  const fetchContributions = async () => {
    try {
      const data = await $fetch<Contribution[]>('/api/contributions');
      contributions.value = data;
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    }
  };

  return { contributions, fetchContributions };
};
