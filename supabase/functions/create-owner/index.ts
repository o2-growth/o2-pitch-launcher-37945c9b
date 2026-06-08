import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const email = "pedro.albite@o2inc.com.br";
  const password = "Alterar@01";

  const { data: existing } = await admin.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === email);
  if (found) {
    const { error } = await admin.auth.admin.updateUserById(found.id, {
      password,
      email_confirm: true,
      user_metadata: { role: "owner" },
    });
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify({ updated: true, id: found.id }), {
      headers: { "content-type": "application/json" },
    });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: "owner" },
  });
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  return new Response(JSON.stringify({ created: true, id: data.user?.id }), {
    headers: { "content-type": "application/json" },
  });
});