export default defineEventHandler(() => {
  // No complex logic, no authorization, just a simple response for testing reachability.
  return {
    pong: 'user-api is reachable',
    timestamp: new Date().toISOString()
  };
});