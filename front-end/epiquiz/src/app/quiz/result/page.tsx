"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function ResultPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const score = Number(searchParams.get("score")) || 0;
    const total = Number(searchParams.get("total")) || 0;

    const percentage = Math.round((score / total) * 100);

    const getMessage = () => {
        if (percentage === 100) return "Parfait !";
        if (percentage >= 70) return "Bien Jouer";
        if (percentage == 50) return "Pas mal, continue comme ça !";
        if (percentage < 50) return "Pas mal, contine de t'améliorer!";
        if (percentage <= 10) return "C'est pas grave tu réussiras la prochaine fois";

        return "Tu peux t'améliorer, ne lâche rien";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">Résultats du Quiz</h1>
                <p className="text-lg mb-2">
                    Score : <strong>{score}</strong> / {total}
                </p>
                <p className="text-xl font-semibold text-gray-700 mb-6">
                    {getMessage()}
                </p>

                <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                    />
                </div>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push("/quiz")}
                >
                    Retour à la liste des quiz
                </Button>
            </div>
        </div>
    );
}
