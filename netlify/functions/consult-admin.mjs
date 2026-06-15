import { getStore } from "@netlify/blobs";

const STORE_NAME = "consultations";
const STORE_KEY = "all";

function getConsultStore() {
  return getStore({ name: STORE_NAME, consistency: "strong" });
}

function isAuthorized(req) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return req.headers.get("x-admin-password") === adminPassword;
}

export default async (req) => {
  if (!isAuthorized(req)) {
    const message = process.env.ADMIN_PASSWORD
      ? "비밀번호가 올바르지 않습니다."
      : "관리자 비밀번호가 설정되지 않았습니다. Netlify 환경 변수 ADMIN_PASSWORD를 설정해 주세요.";
    return Response.json({ error: message }, { status: 401 });
  }

  const store = getConsultStore();

  try {
    if (req.method === "GET") {
      const list = (await store.get(STORE_KEY, { type: "json" })) || [];
      const unread = list.filter((item) => !item.is_read).length;
      return Response.json({ list, unread });
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const { id, is_read: isRead } = body;

      if (!id) {
        return Response.json({ error: "id가 필요합니다." }, { status: 400 });
      }

      const list = (await store.get(STORE_KEY, { type: "json" })) || [];
      const next = list.map((item) =>
        item.id === id ? { ...item, is_read: !!isRead } : item
      );
      await store.setJSON(STORE_KEY, next);

      return Response.json({ ok: true });
    }

    if (req.method === "DELETE") {
      const body = await req.json();
      const { id } = body;

      if (!id) {
        return Response.json({ error: "id가 필요합니다." }, { status: 400 });
      }

      const list = (await store.get(STORE_KEY, { type: "json" })) || [];
      const next = list.filter((item) => item.id !== id);
      await store.setJSON(STORE_KEY, next);

      return Response.json({ ok: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (err) {
    console.error("consult-admin error:", err);
    return Response.json({ error: "요청 처리에 실패했습니다." }, { status: 500 });
  }
};
