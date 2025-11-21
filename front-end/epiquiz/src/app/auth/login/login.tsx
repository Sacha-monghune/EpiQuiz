"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("LOGIN ERROR:", text);
        throw new Error("Identifiants invalides");
      }

      router.push("/quiz");
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/auth/google/login";
  };

  return (
    <section className="h-screen flex items-center justify-center bg-blue-100">
      <div className="flex flex-col items-center">
        <Link href="/">
          <h1 className="font-Montsserat text-5xl font-bold text-blue-900 p-5">
            EPIQUIZ
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 w-96 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-blue-950">
            Sign in to your account
          </h2>

          <input
            type="email"
            placeholder="Email"
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg w-full p-2.5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="********"
            className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg w-full p-2.5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-3"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="h-5 w-5 mr-2"
            />
            Login with Google
          </button>

          <p className="text-sm font-light text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium hover:underline text-blue-500"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
