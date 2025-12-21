// app/middleware/authorize.ts
// Assuming isAdmin is auto-imported from shared/utils/abilities
// Assuming authorize and denies are auto-imported from nuxt-authorization

export default defineNuxtRouteMiddleware(async (to) => {
  // Get the required ability from the page's metadata
  const requiredAbility = to.meta.ability;

  // If the page doesn't require a specific ability, do nothing.
  if (!requiredAbility) {
    return;
  }

  // Use the client-side 'authorize' helper from nuxt-authorization.
  // This will throw an H3Error if the user is not authorized,
  // which Nuxt will catch and display as an error page.
  await authorize(requiredAbility);
});