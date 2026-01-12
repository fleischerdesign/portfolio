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
      instagram: '',
      birthday: null,
      birthLocation: '',
      street: '',
      houseNumber: '',
      zipcode: '',
      city: '',
      country: { de: '', en: '' },
      maritalStatus: { de: '', en: '' },
      driversLicense: { de: '', en: '' },
      availabilityStatus: { de: '', en: '' },
      summary: { de: '', en: '' }
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
      birthday: profile.birthday,
      birthLocation: profile.birthLocation,
      street: profile.street,
      houseNumber: profile.houseNumber,
      zipcode: profile.zipcode,
      city: profile.city,
      country: profile.country,
      maritalStatus: profile.maritalStatus,
      driversLicense: profile.driversLicense,
      availabilityStatus: profile.availabilityStatus,
      summary: profile.summary,
    }
  };
});
