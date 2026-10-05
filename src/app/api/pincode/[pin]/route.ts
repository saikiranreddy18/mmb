import { lookupPincode } from "@/lib/shipping/pincode";

export async function GET(_req: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  try {
    const location = await lookupPincode(pin);
    if (!location) return Response.json({ error: "not-found" }, { status: 404 });
    return Response.json(location, { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503 });
  }
}
