export default defineNuxtRouteMiddleware(async (to) => {
  const requiredAbility = to.meta.ability;

  if (!requiredAbility) {
    return;
  }

  if (await denies(requiredAbility)) {
    const { loggedIn } = useUserSession();

    if (!loggedIn.value) {
      return navigateTo({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
  }

  await authorize(requiredAbility);
});