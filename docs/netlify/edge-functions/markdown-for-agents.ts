// Content negotiation for Markdown-preferring clients (AI agents, CLI tools).
//
// Every docs page has a Markdown mirror generated at build time
// (vitepress-plugin-llms): /js/reliability -> /js/reliability.md.
// When a request carries `Accept: text/markdown`, serve the mirror
// instead of the HTML at the same canonical URL.
export default async (request: Request, context: any) => {
  if (request.method !== "GET") return;

  const accept = request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  // Asset-like paths have no Markdown mirror
  if (/\.[a-z0-9]+$/i.test(path)) return;

  // The landing page has no Markdown mirror either; serve the agent-facing
  // index (llms.txt) as its Markdown representation.
  const mdUrl = path
    ? new URL(`${path}.md`, url.origin)
    : new URL("/llms.txt", url.origin);
  const response =
    typeof context.rewrite === "function"
      ? await context.rewrite(mdUrl)
      : await fetch(mdUrl);
  if (response.status !== 200) return;

  const headers = new Headers(response.headers);
  headers.set("content-type", "text/markdown; charset=utf-8");
  headers.set("vary", "Accept");

  return new Response(response.body, { status: 200, headers });
};

export const config = {
  path: "/*",
  excludedPath: [
    "/assets/*",
    "/*.md",
    "/*.txt",
    "/*.html",
    "/*.png",
    "/*.jpg",
    "/*.svg",
    "/*.ico",
    "/*.js",
    "/*.css",
    "/*.json",
    "/*.xml",
  ],
};
