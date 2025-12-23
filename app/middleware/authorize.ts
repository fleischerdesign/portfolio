export default defineNuxtRouteMiddleware(async (to) => {
  const requiredAbility = to.meta.ability;

  if (!requiredAbility) {
    return;
  }

  await authorize(requiredAbility);
});