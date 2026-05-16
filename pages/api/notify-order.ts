import type { NextApiRequest, NextApiResponse } from "next";
import type { OrderPlacedLine, OrderPlacedSnapshot } from "@/features/checkout/order-placed-snapshot";
import { sendTelegramMessage } from "@/lib/telegram";
import { common, replaceCopy } from "@/shared/data/common";

const MAX_LINES = 80;
const MAX_STR = 2000;

function isOrderLine(x: unknown): x is OrderPlacedLine {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.name === "string" &&
    o.name.length <= 200 &&
    typeof o.quantity === "number" &&
    Number.isFinite(o.quantity) &&
    o.quantity >= 1 &&
    o.quantity <= 999 &&
    typeof o.lineTotal === "number" &&
    Number.isFinite(o.lineTotal) &&
    o.lineTotal >= 0 &&
    o.lineTotal <= 1_000_000
  );
}

function parseSnapshot(body: unknown): OrderPlacedSnapshot | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (typeof o.orderId !== "string" || o.orderId.length < 3 || o.orderId.length > 64) return null;
  if (typeof o.total !== "number" || !Number.isFinite(o.total) || o.total < 0 || o.total > 1_000_000) return null;
  if (typeof o.deliveryTitle !== "string" || o.deliveryTitle.length > 200) return null;
  if (typeof o.deliveryAddress !== "string" || o.deliveryAddress.length > MAX_STR) return null;
  if (typeof o.customerName !== "string" || o.customerName.length > 200) return null;
  if (typeof o.customerPhone !== "string" || o.customerPhone.length > 40) return null;
  if (typeof o.placedAt !== "number" || !Number.isFinite(o.placedAt)) return null;
  if (!Array.isArray(o.lines) || o.lines.length === 0 || o.lines.length > MAX_LINES) return null;
  if (!o.lines.every(isOrderLine)) return null;
  return {
    orderId: o.orderId,
    lines: o.lines as OrderPlacedLine[],
    total: o.total,
    deliveryTitle: o.deliveryTitle,
    deliveryAddress: o.deliveryAddress,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    placedAt: o.placedAt,
  };
}

function formatOrderMessage(s: OrderPlacedSnapshot): string {
  const t = common.telegram;
  const lineText = s.lines
    .map((l) =>
      replaceCopy(t.lineItem, {
        name: l.name,
        qty: l.quantity,
        lineTotal: l.lineTotal,
      }),
    )
    .join("\n");
  return [
    replaceCopy(t.newOrder, { orderId: s.orderId }),
    replaceCopy(t.totalLine, { total: s.total }),
    "",
    lineText,
    "",
    replaceCopy(t.customer, { name: s.customerName }),
    replaceCopy(t.phone, { phone: s.customerPhone }),
    "",
    replaceCopy(t.deliverTo, { title: s.deliveryTitle }),
    s.deliveryAddress,
  ].join("\n");
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ ok: boolean }>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false });
  }

  const snap = parseSnapshot(req.body);
  if (!snap) {
    return res.status(400).json({ ok: false });
  }

  const sent = await sendTelegramMessage(formatOrderMessage(snap));
  if (!sent) {
    return res.status(502).json({ ok: false });
  }

  return res.status(200).json({ ok: true });
}
