import { userService } from '~~/server/services/user.service';

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  // Casting to string | undefined because config types might not be fully inferred yet
  const ownerEmail = config.ownerEmail as string | undefined; 

  const profile = await userService.getOwner(ownerEmail);

  if (!profile) {
    return {
      name: 'Portfolio Owner',
      email: '',
      phone: '',
      website: '',
      github: '',
      linkedin: '',
      instagram: ''
    };
  }

  // Return only public fields
  return {
    profile: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      website: profile.website,
      github: profile.github,
      linkedin: profile.linkedin,
      instagram: profile.instagram,
    }
  };
});
