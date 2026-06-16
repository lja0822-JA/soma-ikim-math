export default async (req) => {
  if (req.method !== "GET" && req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return Response.json(
      { error: "관리자 비밀번호가 설정되지 않았습니다. Netlify 환경 변수 ADMIN_PASSWORD를 설정해 주세요." },
      { status: 503 }
    );
  }

  const provided = (req.headers.get("x-admin-password") || "").trim();
  if (provided !== adminPassword.trim()) {
    return Response.json({ error: "비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  return Response.json({ ok: true });
};
