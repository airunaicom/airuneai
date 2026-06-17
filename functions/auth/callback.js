export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("Missing code", { status: 400 });
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      client_id: "Ov23li4qQxkZ2GfqNazW",
      client_secret: "c076b22fe071427975059e2fb160c933a8f778ee",
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(`Auth error: ${JSON.stringify(tokenData)}`, { status: 400 });
  }

  return Response.redirect(
    `https://airuneai.com/?token=${tokenData.access_token}`,
    302
  );
}
