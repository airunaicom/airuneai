export async function onRequest(context) {
  const { env } = context;
  return new Response(`GH_ID: ${env.GH_ID} | GH_SECRET length: ${env.GH_SECRET?.length ?? 'undefined'}`, { status: 200 });
}
