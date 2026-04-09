import { applicationService } from "~~/server/services/application.service";
import { applicationHistoryCreateSchema } from "#shared/schemas/application.schema";
import { z } from "zod";

const updateSchema = applicationHistoryCreateSchema.partial();

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const { historyId } = await getValidatedRouterParams(
    event,
    z.object({
      slug: z.string(),
      historyId: z.coerce.number().int().positive(),
    }).parse,
  );

  const data = await readValidatedBody(event, updateSchema.parse);

  try {
    const [updatedHistory] = await applicationService.updateHistory(historyId, {
      status: data.status,
      notes: data.notes,
      scheduled_at: data.scheduled_at,
    });

    if (!updatedHistory) {
      throw createError({
        statusCode: 404,
        statusMessage: "History entry not found",
      });
    }

    return updatedHistory;
  } catch (error) {
    console.error("Error updating application history:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Could not update history entry",
    });
  }
});
