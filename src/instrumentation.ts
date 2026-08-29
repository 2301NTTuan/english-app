import type { Instrumentation } from "next";
import { logEvent } from "@/lib/observability/logger";

export const onRequestError: Instrumentation.onRequestError = async (_error, request, context) => {
  const path = request.path.split("?", 1)[0] || "/";
  const requestIdHeader = request.headers["x-request-id"];
  const requestId = Array.isArray(requestIdHeader) ? requestIdHeader[0] : requestIdHeader;
  logEvent("error", "request.unhandled_error", {
    requestId,
    method: request.method,
    path,
    route: context.routePath,
    routeType: context.routeType,
  });
};
