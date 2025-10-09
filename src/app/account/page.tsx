"use client";

import AccountForm from "@/components/AccountForm";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase.auth.getUser();
      if (error) console.error(error);
      setUser(data.user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-[60vh] text-zinc-400">
        Cargando cuenta...
      </div>
    );

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center text-zinc-300">
        <p className="text-lg mb-4">⚠️ No has iniciado sesión</p>
        <a
          href="/login"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Ir al login
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-24 px-6">
      <h1 className="text-2xl font-bold text-orange-400 mb-2">Mi Cuenta</h1>
      <p className="text-zinc-400 mb-8">
        Administra tus datos personales y tu seguridad.
      </p>
      <AccountForm user={user} />
    </div>
  );
}
