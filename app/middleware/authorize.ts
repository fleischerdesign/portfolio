export default defineNuxtRouteMiddleware(async (to) => {
  const requiredAbility = to.meta.ability;

  if (!requiredAbility) {
    return;
  }

  if (await denies(requiredAbility)) {
    const { loggedIn } = useUserSession();

    if (!loggedIn.value) {
      const localePath = useLocalePath();
      return navigateTo({
        path: localePath('/login'),
        query: { redirect: to.fullPath },
      });
    }
  }

  await authorize(requiredAbility);
});