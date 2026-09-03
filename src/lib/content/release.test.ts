import { describe, expect, it } from "vitest";
import { visibleContentStatuses } from "./release";

describe("content release visibility", () => {
  it("keeps true production limited to published content", () => {
    expect(visibleContentStatuses({ NODE_ENV: "production", CONTENT_RELEASE_CHANNEL: undefined })).toEqual(["published"]);
    expect(visibleContentStatuses({ NODE_ENV: "production", CONTENT_RELEASE_CHANNEL: "unexpected" })).toEqual(["published"]);
  });

  it("exposes validated content only in local/test or the explicit preview channel", () => {
    const previewStatuses = ["validated", "reviewed", "published"];
    expect(visibleContentStatuses({ NODE_ENV: "development", CONTENT_RELEASE_CHANNEL: undefined })).toEqual(previewStatuses);
    expect(visibleContentStatuses({ NODE_ENV: "test", CONTENT_RELEASE_CHANNEL: undefined })).toEqual(previewStatuses);
    expect(visibleContentStatuses({ NODE_ENV: "production", CONTENT_RELEASE_CHANNEL: "validated-preview" })).toEqual(previewStatuses);
  });
});
