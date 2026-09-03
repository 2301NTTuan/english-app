import type { ContentStatus } from "@/types/domain";

export const VALIDATED_PREVIEW_CHANNEL = "validated-preview";

interface ContentEnvironment { NODE_ENV?: string; CONTENT_RELEASE_CHANNEL?: string }

export function visibleContentStatuses(environment: ContentEnvironment = process.env): ContentStatus[] {
  const validatedPreview = environment.NODE_ENV !== "production" || environment.CONTENT_RELEASE_CHANNEL === VALIDATED_PREVIEW_CHANNEL;
  return validatedPreview ? ["validated", "reviewed", "published"] : ["published"];
}
