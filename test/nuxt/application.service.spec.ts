import { describe, it, expect, beforeEach, vi } from 'vitest'
import { db } from '~~/server/utils/db'
import { applications, companies, addresses, contacts, applicationHistories, applications_to_contacts } from '~~/server/db/schema'
import type { ApplicationCreatePayload } from '~~/shared/schemas/application.schema'
import { applicationService } from '~~/server/services/application.service'

// Stub global 'db'
vi.stubGlobal('db', db)

describe('ApplicationService', () => {
  beforeEach(async () => {
    // Cleanup (Child -> Parent)
    await db.delete(applications_to_contacts)
    await db.delete(applicationHistories)
    await db.delete(applications)
    await db.delete(contacts)
    await db.delete(companies)
    await db.delete(addresses)
  })

  it('should create an application, company and address automatically', async () => {
    const appData: ApplicationCreatePayload = {
      slug: 'test-application',
      title: 'Senior Developer',
      companyName: 'Test Corp',
      companyAddress: {
        street: 'Tech Lane',
        city: 'Berlin',
        zipcode: '10115',
        country: { de: 'Deutschland', en: 'Germany' }
      },
      url: 'https://test-corp.com/jobs/1'
    }

    // Since we refactored createOrUpdate, it handles everything
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (applicationService as any).createOrUpdate(appData)

    expect(result).toBeDefined()
    expect(result.action).toBe('inserted')
    expect(result.title).toBe('Senior Developer')

    // Verify Relations
    const createdApp = await applicationService.getBySlug('test-application')
    expect(createdApp).toBeDefined()
    expect(createdApp?.company?.name).toBe('Test Corp')
    expect(createdApp?.company?.address?.city).toBe('Berlin')
    
    // Check initial history
    expect(createdApp?.histories.length).toBeGreaterThan(0)
    expect(createdApp?.histories[0]!.status).toBe('draft') // Default on insert
  })

  it('should reuse existing company and update address if needed', async () => {
    // 1. Create Company manually
    const [address] = await db.insert(addresses).values({ city: 'Munich' }).returning()
    await db.insert(companies).values({ name: 'Existing Corp', addressId: address!.id })

    // 2. Create Application for SAME company
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (applicationService as any).createOrUpdate({
      slug: 'new-app-existing-comp',
      title: 'Frontend Dev',
      companyName: 'Existing Corp',
      // No address update this time
    } as ApplicationCreatePayload)

    expect(result.company?.addressId).toBe(address!.id) // Should link to existing address
  })

  it('should throw error when adding history to non-existent application', async () => {
    await expect(async () => {
      await applicationService.addHistory('fake-slug', { status: 'applied' })
    }).rejects.toThrowError() // Expect generic error or specific message
  })
})
