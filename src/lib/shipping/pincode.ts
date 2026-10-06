/**
 * Indian PIN code lookup (India Post's public directory, api.postalpincode.in).
 * Used to validate a PIN code and name the place before asking Shopify for
 * delivery rates. Server-only: the directory doesn't send CORS headers.
 */
import "server-only";
import { PINCODE_PATTERN, type PincodeLocation } from "./types";

/** State name (as India Post spells it) → Shopify province code. */
const PROVINCE_CODES: Record<string, string> = {
  "andaman and nicobar islands": "AN",
  "andhra pradesh": "AP",
  "arunachal pradesh": "AR",
  assam: "AS",
  bihar: "BR",
  chandigarh: "CH",
  chhattisgarh: "CG",
  "dadra and nagar haveli": "DN",
  "dadra and nagar haveli and daman and diu": "DN",
  "daman and diu": "DD",
  delhi: "DL",
  goa: "GA",
  gujarat: "GJ",
  haryana: "HR",
  "himachal pradesh": "HP",
  "jammu and kashmir": "JK",
  jharkhand: "JH",
  karnataka: "KA",
  kerala: "KL",
  ladakh: "LA",
  lakshadweep: "LD",
  "madhya pradesh": "MP",
  maharashtra: "MH",
  manipur: "MN",
  meghalaya: "ML",
  mizoram: "MZ",
  nagaland: "NL",
  odisha: "OR",
  puducherry: "PY",
  pondicherry: "PY",
  punjab: "PB",
  rajasthan: "RJ",
  sikkim: "SK",
  "tamil nadu": "TN",
  telangana: "TS",
  tripura: "TR",
  "uttar pradesh": "UP",
  uttarakhand: "UK",
  "west bengal": "WB",
};

type PostOffice = { District: string; State: string; DeliveryStatus: string };
type Response = { Status: string; PostOffice: PostOffice[] | null }[];

/** Returns null when the PIN code doesn't exist. Throws if the directory is unreachable. */
export async function lookupPincode(pincode: string): Promise<PincodeLocation | null> {
  if (!PINCODE_PATTERN.test(pincode)) return null;
  const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
    next: { revalidate: 60 * 60 * 24 * 7 },
    signal: AbortSignal.timeout(6000),
  });
  if (!res.ok) throw new Error(`PIN code directory ${res.status}`);
  const [result] = (await res.json()) as Response;
  const offices = result?.Status === "Success" ? (result.PostOffice ?? []) : [];
  const office = offices.find((o) => o.DeliveryStatus === "Delivery") ?? offices[0];
  if (!office) return null;
  return {
    pincode,
    city: office.District,
    state: office.State,
    provinceCode: PROVINCE_CODES[office.State.trim().toLowerCase().replace(/&/g, "and")] ?? null,
  };
}
