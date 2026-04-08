# Shared Schemas

This directory contains all Zod validation schemas used across the application.

## Structure

| File                    | Description                    |
| ----------------------- | ------------------------------ |
| `blog.schema.ts`        | Blog post validation schemas   |
| `project.schema.ts`     | Project validation schemas     |
| `application.schema.ts` | Job application schemas        |
| `company.schema.ts`     | Company/entity schemas         |
| `contact.schema.ts`     | Contact person schemas         |
| `course.schema.ts`      | Course/education schemas       |
| `document.schema.ts`    | Document schemas               |
| `user.schema.ts`        | User schemas                   |
| `common.schema.ts`      | Shared schemas (address, etc.) |
| `contactForm.schema.ts` | Contact form validation        |

## Types

Types are centrally defined in `../types/`:

- `types/content/status.ts` - Content status enum (draft, published, archived)
- `types/application/status.ts` - Application status enum (draft, applied, interview, etc.)

## Usage

```typescript
import {
  blogPostCreateSchema,
  type BlogPostCreate,
} from "~~/shared/schemas/blog.schema";

// Validation
const data = blogPostCreateSchema.parse(input);
```

## Response Schemas

Response schemas use Zod transforms to automatically map database relations:

```typescript
// Input: { tags: [{ tag: { id: 1, name: 'Tech' } }] }
// Output: { tags: [{ id: 1, name: 'Tech' }] }
const response = blogPostResponseSchema.parse(databaseResult);
```

This eliminates the need for manual mapping functions in services.
