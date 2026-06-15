import { getStore } from "@netlify/blobs";

const STORE_NAME = "consultations";
const STORE_KEY = "all";

function getConsultStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const name = (body.name || "").trim();
    const phone = (body.phone || "").trim();
    const grade = (body.grade || "").trim();
    const message = (body.message || "").trim();

    if (!name || !phone) {
      return Response.json({ error: "이름과 연락처는 필수입니다." }, { status: 400 });
    }

    const store = getConsultStore();
    const list = (await store.get(STORE_KEY, { type: "json" })) || [];

    const entry = {
      id: crypto.randomUUID(),
      student_name: name,
      grade,
      phone,
      message,
      created_at: new Date().toISOString(),
      is_read: false
    };

    list.unshift(entry);
    await store.setJSON(STORE_KEY, list);

    return Response.json({ ok: true, id: entry.id });
  } catch (err) {
    console.error("consult-submit error:", err);
    return Response.json({ error: "상담 저장에 실패했습니다." }, { status: 500 });
  }
};
