import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;
const TARGET_USER_ID = "a3f88c37-c06f-49b6-9396-6e8e748fae54";

async function main() {
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    TARGET_USER_ID,
    {
      user_metadata: {
        role: "super_admin",
        full_name: "IA Shield Founder",
      },
    }
  );

  if (error) {
    console.error("Error updating user:", error.message);
    process.exit(1);
  }

  console.log("Super admin role applied.");
}

main();
