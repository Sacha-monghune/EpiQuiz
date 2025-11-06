"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("http://localhost:4000/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }),
        });
            if (!res.ok) throw new Error("Erreur lors de la création du compte");
            router.push("/auth/login");
        } catch (err: any) {
            setError(err.message || "Erreur inconnue");
        }
    };

    return (
        <section className="h-screen flex items-center justify-center bg-blue-100">
            <div className="flex flex-col items-center">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-lg rounded-xl p-6 w-96 space-y-4"
                >
                    <h2 className="text-2xl font-bold mb-4 text-center text-blue-950">Create an account</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                        S'inscrire
                    </button>
                </form>
            </div>
        </section>
    );
}