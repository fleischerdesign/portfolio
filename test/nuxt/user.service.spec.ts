import { describe, it, expect, beforeEach, vi } from 'vitest'
import { userService } from '~~/server/services/user.service'
import { db } from '~~/server/utils/db'
import { users, apiKeys } from '~~/server/db/schema'
import { generateApiKey, hashApiKey } from '~~/server/utils/apiKey'

// Stub global 'db'
vi.stubGlobal('db', db)
vi.stubGlobal('generateApiKey', generateApiKey)
vi.stubGlobal('hashApiKey', hashApiKey)

describe('UserService', () => {
  beforeEach(async () => {
    await db.delete(apiKeys)
    await db.delete(users)
  })

  it('should create an API key for a user', async () => {
    // 1. Setup User
    const [user] = await db.insert(users).values({
      authProviderId: 'github:123',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin'
    }).returning()

    // 2. Create API Key
    const result = await userService.createApiKey(user.id, 'Test Key')

    expect(result.apiKey).toBeDefined()
    expect(result.apiKey).toMatch(/^sk_/) // Check prefix
    expect(result.message).toBeDefined()

    // 3. Verify DB Storage (Hashed)
    const storedKeys = await db.query.apiKeys.findMany({
      where: (k, { eq }) => eq(k.userId, user.id)
    })

    expect(storedKeys.length).toBe(1)
    expect(storedKeys[0].name).toBe('Test Key')
    expect(storedKeys[0].keyHash).not.toBe(result.apiKey) // Should be hashed!
    expect(storedKeys[0].keyHash.length).toBeGreaterThan(0)
  })

  it('should get the owner or admin user', async () => {
    // 1. Create normal user
    await db.insert(users).values({
        authProviderId: 'github:999',
        email: 'user@example.com',
        role: 'user'
    })

    // 2. Create admin
    await db.insert(users).values({
        authProviderId: 'github:111',
        email: 'admin@example.com',
        role: 'admin'
    })

    // 3. Test getOwner (fallback to admin)
    const owner = await userService.getOwner()
    expect(owner).toBeDefined()
    expect(owner?.email).toBe('admin@example.com')

    // 4. Test getOwner by email
    const specific = await userService.getOwner('user@example.com')
    expect(specific?.email).toBe('user@example.com')
  })

  it('should return undefined if no user found', async () => {
    // DB is empty due to beforeEach
    const owner = await userService.getOwner()
    expect(owner).toBeUndefined()
  })
})
