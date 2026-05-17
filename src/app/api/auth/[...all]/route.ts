import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

async function loggedHandler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const isSocialSignIn = url.pathname.endsWith("/sign-in/social");

  if (isSocialSignIn) {
    let body: unknown = null;
    try {
      body = await req.clone().json();
    } catch {}
    console.log("[auth-route] OAuth initiation request:", {
      method: req.method,
      pathname: url.pathname,
      body,
    });
  }

  const method = req.method === "POST" ? "POST" : "GET";
  const res = await (method === "POST" ? handler.POST(req as never) : handler.GET(req as never));

  if (isSocialSignIn) {
    const location = res.headers.get("location");
    if (location) {
      try {
        const redirectUrl = new URL(location);
        console.log("[auth-route] OAuth redirect to provider:", {
          provider: redirectUrl.hostname,
          redirect_uri: redirectUrl.searchParams.get("redirect_uri"),
          fullLocation: location.slice(0, 200),
        });
      } catch {
        console.log("[auth-route] OAuth location header (raw):", location.slice(0, 200));
      }
    } else {
      console.log("[auth-route] OAuth initiation response — no Location header. Status:", res.status);
    }
  }

  return res;
}

export const GET = (req: Request) => loggedHandler(req);
export const POST = (req: Request) => loggedHandler(req);

