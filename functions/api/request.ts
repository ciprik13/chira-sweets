import { handleRequest, type Env } from "../../src/server/handle-request";

/** Cloudflare Pages Function: POST /api/request (see src/server/handle-request.ts). */
export const onRequest = (context: { request: Request; env: Env }) =>
  handleRequest(context.request, context.env);
