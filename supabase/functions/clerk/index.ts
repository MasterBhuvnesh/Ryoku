import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { Webhook } from 'https://esm.sh/svix';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);
const clerkSecret = Deno.env.get('CLERK_WEBHOOK_SECRET');

serve(async (req: Request) => {
  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    // Verify the webhook signature
    const wh = new Webhook(clerkSecret);
    const verifiedPayload = wh.verify(payload, headers) as Record<string, any>;

    // Handle Clerk events
    if (verifiedPayload.type === 'user.created' || verifiedPayload.type === 'user.updated') {
      const { id, first_name, last_name, username } = verifiedPayload.data;

      // Upsert user data into Supabase
      const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          clerk_id: id,
          first_name,
          last_name,
        },
        { onConflict: 'clerk_id' } // Ensure upsert works based on clerk_id
      );

      if (error) {
        console.error('Error syncing user:', error);
        return new Response(JSON.stringify({ error: 'Failed to sync user' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});