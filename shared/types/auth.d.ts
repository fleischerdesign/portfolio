// This file will augment the User type provided by nuxt-auth-utils
declare module '#auth-utils' {
  type User = import('../schemas/user.schema').SessionUser;
}

export {}