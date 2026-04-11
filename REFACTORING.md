# Refactoring Plan

Stepping through codebase improvements for DRY, SOLID, and Clean Code.

Legend: [ ] = pending, [x] = done

---

## P0 -- Kritisch

### Engine & Service Architecture (zusammengefasst aus P0.2 + P1.9 + P2.1 + P2.9)

- [x] **P0.2a** Vereinheitlichter Engine: `createEntityService()` mit optionalem `translationTable` (ersetzt beide bisherigen Factories)
- [x] **P0.2b** Content Service Factory: `createContentService()` mit typed Query-Callbacks (getPublicAll, getPublicBySlug, getStudioAll, getStudioById, create, update)
- [x] **P0.2c** `blog.service.ts` auf neue Factories umstellen
- [x] **P0.2d** `project.service.ts` auf neue Factories umstellen
- [x] **P0.2e** Bestehende Tests pruefen (blog, project) -- alle muessen gruen bleiben

### Component Decomposition

- [x] **P0.1** `applications/[slug]/index.vue` (1282 Zeilen) in 6-8 Komponenten zerlegen (erledigt: ~270 Zeilen)
- [x] **P0.3** Shared content schema helpers (`content.schema.ts`): Date overrides, common create extensions, `buildCommonRelations()`

### i18n Migration (einheitliche Strategie)

- [x] **P0.4** `nowEntries` auf Translation-Table-Pattern migrieren (Schema + Migration + Service)
- [ ] **P0.5** Tags, Categories, Technologies auf Translation-Table-Pattern migrieren (zukuenftig)

## P1 -- Hoch

- [ ] **P1.1** `print.vue` (753 Zeilen) in einzelne Print-Page-Komponenten zerlegen
- [ ] **P1.2** `studio/blog/[id].vue` (459 Zeilen) zerlegen
- [ ] **P1.3** `studio/documents.vue` (448 Zeilen) zerlegen
- [x] **P1.4** `schema.ts` (630 Zeilen) nach Domain aufteilen → `server/db/schema/` (application, user, course, now, taxonomy, content, relations, index)
- [x] **P1.5** `StatusBadge`-Komponente extrahieren (ersetzt 4x `getStatusColor()` + `getStatusChipClasses` aus `useApplicationUtils`)
- [x] **P1.6** `MarkdownEditor`-Komponente extrahieren (ersetzt 2x duplicat split-view)
- [x] **P1.7** `LocaleSwitcher`-Komponente extrahieren (ersetzt 2x duplicat UI)
- [x] **P1.8** `StudioSearchFilter`-Komponente extrahieren (ersetzt 2x search+filter+grid)
- [ ] **P1.9** Konsistente Fehlerbehandlung: `throwIfNull()` Helper + einheitliche 404-Strategie
- [ ] **P1.10** `Document-Fallback` Check in `application.service.ts` als private Methode extrahieren

## P2 -- Mittel

- [ ] **P2.1** Engine-Spread entfernen: Private Referenz statt `...engine` in Services
- [ ] **P2.2** `usePageSeo()` Composable extrahieren (ersetzt 9+ useSeoMeta Boilerplate)
- [ ] **P2.3** `useClickOutside()` Composable extrahieren (ersetzt 2x manual handler)
- [ ] **P2.4** `useDateFormatter()` Composable: 3+ date formatting Implementierungen konsolidieren
- [ ] **P2.5** `resolveTranslation()` Utility extrahieren (ersetzt 6x duplicat pattern)
- [ ] **P2.6** `FileStorageService` als Abstraktion (ersetzt sync fs + duplicat delete pattern)
- [ ] **P2.7** `MailService` als Abstraktion (ersetzt per-request SMTP Transporter)
- [ ] **P2.8** `PageContainer` in Default-Layout oder als Komponente (ersetzt 25+ duplicat CSS class)
- [ ] **P2.9** Transaction-Wrapper in Engine integrieren (ersetzt 9+ boilerplate wrapper)
- [ ] **P2.10** `createdAt`/`updatedAt` Timestamp Factory in schema.ts
- [ ] **P2.11** `Tag` vs `Chip` Komponente: Ueberschneidung klaeren
- [ ] **P2.12** Icon-Name-Mapping aus Alert.vue und Toast.vue in Shared Utility

## P3 -- Niedrig

- [ ] **P3.1** Hardcoded Strings → i18n (6+ Komponenten: AddressForm, ApplicationAttachments, CourseList, ContactForm, ImageUploader, Select)
- [ ] **P3.2** Magic Strings → Konstanten (Status-Enums verbinden zwischen schema.ts und shared/types/)
- [ ] **P3.3** `as any` Type Assertions entfernen (20+ Vorkommen): EditorState-Type-System korrigieren
- [ ] **P3.4** `DEFAULT_LOCALE` Konflikt klaeren (`'de'` in locales.ts vs `'en'` in nuxt.config.ts)
- [ ] **P3.5** Sync fs → async fs/promises in application.service.ts und document.service.ts
- [ ] **P3.6** Test-Infrastruktur: Factories, Shared Cleanup, fehlende Service-Tests
- [ ] **P3.7** `confirm()` Browser-Dialog → UiModal in documents.vue und CourseList.vue
- [ ] **P3.8** Security: Timing-Attack in now/index.post.ts, File-Size-Limit bei Uploads, Puppeteer Resource Leak
- [ ] **P3.9** API Client Layer: Hardcoded URL Strings zentralisieren
- [ ] **P3.10** Profile-Fetch Pattern: `provide/inject` statt 4x `callOnce('fetch-profile')`
- [ ] **P3.11** Consistent `defineProps` style (Options API → Generic syntax)
- [ ] **P3.12** Remove dead code: commented-out block in Overview.vue, empty script in Hero.vue, dead `upload` emit in ImageUploader.vue
- [ ] **P3.13** `Math.random()` in SectionHeader.vue template → SSR hydration fix
- [ ] **P3.14** `console.log`/`console.error` in API Routes → structured logger
