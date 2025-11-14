"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Button from "@mui/material/Button";

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Récupération des données passées depuis le quiz
  const score = Number(searchParams.get("score")) || 0;
  const total = Number(searchParams.get("total")) || 0;
  const questions = JSON.parse(searchParams.get("questions") || "[]");
  const userResponses = JSON.parse(searchParams.get("responses") || "[]");

  const percentage = Math.round((score / total) * 100);

  const getMessage = () => {
    if (percentage <= 10) return "T'es sûr t'es bon???";
    if (percentage < 50) return "ARRRH.... Faible!";
    if (percentage === 50) return "Tu nous vends le bred";
    if (percentage >= 70) return "Le brèd lé fré";
    if (percentage === 100) return "Un bon yab";
    return "Améliore ton commerce brèd";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-black mb-4 text-center">
          Résultats du Quiz
        </h1>

        <p className="text-lg mb-2 text-center text-black">
          Score : <strong>{score}</strong> / {total}
        </p>
        <p className="text-xl font-semibold mb-6 text-center text-black">
          {getMessage()}
        </p>

        {/* Barre de progression */}
        <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
          <div
            className="bg-blue-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Tableau des résultats par question */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-black">Question</th>
                <th className="px-4 py-2 text-left text-black">Votre réponse</th>
                <th className="px-4 py-2 text-left text-black">Bonne réponse</th>
                <th className="px-4 py-2 text-left text-black">Résultat</th>
                <th className="px-4 py-2 text-left text-black">Explications</th>               
              </tr>
            </thead>
            <tbody>
              {questions.map((q: any, idx: number) => {
                const userAnswer = userResponses[idx] || "Non répondu";
                const isCorrect = userAnswer === q.correct;
                return (
                  <tr key={idx} className={isCorrect ? "bg-green-50" : "bg-red-50"}>
                    <td className="border border-gray-300 px-4 py-2 text-black">{q.question}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{userAnswer}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{q.correct}</td>
                    <td className="border border-gray-300 px-4 py-2 text-black">
                      {isCorrect ? "Correct" : "Faux"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-black">{q.description_answer || "Pas d'explication"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/quiz")}
          >
            Retour à la liste des quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
