/**
 * Receives Content-Security-Policy-Report-Only violation reports (see
 * next.config.ts) and writes a compact line to the server log, so the policy can
 * be checked against real traffic before it is enforced.
 */
export async function POST(request: Request) {
  try {
    const text = (await request.text()).slice(0, 4000);
    const body = JSON.parse(text);
    const r = body["csp-report"] ?? body;
    console.warn(
      "[csp-report]",
      JSON.stringify({
        page: r["document-uri"],
        directive: r["violated-directive"] ?? r["effective-directive"],
        blocked: r["blocked-uri"],
        source: r["source-file"],
      }),
    );
  } catch {
    // Malformed or empty reports are ignored.
  }
  return new Response(null, { status: 204 });
}
