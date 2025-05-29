type Contribution = {
  date: string;
  count: number;
}

export const useGitHubContributions = () => {
  const contributions = ref<Contribution[]>([]);

  const fetchContributions = async () => {
    const { data } = await useFetch<Contribution[]>('/api/contributions');
    contributions.value = data.value ?? [];
  };

  onUnmounted(() => {
    contributions.value = [];
  });

  return { contributions, fetchContributions };
};