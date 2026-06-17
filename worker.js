export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'};
    if (request.method === 'OPTIONS') return new Response(null, {headers: cors});
    if (url.pathname === '/auth/login') {
      return Response.redirect(`https://github.com/login/oauth/authorize?client_id=${env.GH_ID}&scope=repo,user&redirect_uri=https://airuneai.com/auth/callback`, 302);
    }
    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      const res = await fetch('https://github.com/login/oauth/access_token', {method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({client_id:env.GH_ID,client_secret:env.GH_SECRET,code})});
      const data = await res.json();
      return Response.redirect(`https://airuneai.com?token=${data.access_token}`, 302);
    }
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      const body = await request.json();
      const res = await fetch('https://api.anthropic.com/v1/messages', {method:'POST',headers:{'Content-Type':'application/json','x-api-key':env.AI_KEY,'anthropic-version':'2023-06-01'},body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:1000,system:'You are airuneai, an AI coding agent. Be concise.',messages:body.messages})});
      const data = await res.json();
      return new Response(JSON.stringify(data), {headers:{...cors,'Content-Type':'application/json'}});
    }
    return new Response('OK');
  }
};
