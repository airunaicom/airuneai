
export async function onRequest(context) {
  const { request, env } = context;
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
      client_id: env.GH_ID,
      client_secret: env.GH_SECRET,
      code: code,
    }),
  });

  const tokenData = await tokenResponse.json();

  if (tokenData.error) {
    return new Response(`Auth error: ${JSON.stringify(tokenData)}`, { status: 400 });
  }

  const accessToken = tokenData.access_token;

  return Response.redirect(
    `https://airuneai.com/?token=${accessToken}`,
    302
  );
}
