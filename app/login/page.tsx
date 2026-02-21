"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
     const res =  await login(email, password);
      // 🔁 redirect after token is saved
      router.replace("/admin");
    } catch (err) {
      setError("Invalid credentials");
    }
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-lg border p-6 shadow"
      >
        <h1 className="mb-4 text-xl font-bold">Admin Login</h1>

        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        <input
          className="mb-3 w-full border p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="mb-4 w-full border p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
}