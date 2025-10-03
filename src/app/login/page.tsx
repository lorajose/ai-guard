// src/app/login/page.tsx
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-6">
          Inicia Sesión en <span className="text-orange-500">AI Guard</span>
        </h1>
        <AuthForm mode="login" />
      </div>
    </main>
  );
}
