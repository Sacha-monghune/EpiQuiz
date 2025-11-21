"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
  const { id } = useParams();
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [point, setPoint] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  // 🔹 Récupération des questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
            const res = await fetch(`http://localhost:4000/quiz/${id}`);
            if (!res.ok) throw new Error("Erreur API questions");
            const data = await res.json();
            setQuestions(data || []);
            console.log(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des questions:", err);
            }
        };
        fetchQuestions();
    }, [id]);

  // 🔹 Initialisation du timer à chaque question
    useEffect(() => {
        if (questions.length > 0 && questions[current]) {
        setTimeLeft(questions[current].timer ?? 30);
        }
    }, [current, questions]);

  // 🔹 Décompte automatique
// ⏱️ Initialisation du timer quand la question change
useEffect(() => {
  if (questions.length > 0 && questions[current]) {
    setTimeLeft(questions[current].timer ?? 30); // Assure que timer existe
    setSelectedAnswer(null); // reset sélection
    setShowExplanation(false);
  }
}, [current, questions]);

// ⏱️ Décompte automatique
useEffect(() => {
  if (selectedAnswer !== null || timeLeft <= 0) return;

  const interval = setInterval(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(interval);
        handleNextQuestion(); // passe automatiquement à la question suivante
        return 0;
      }
      return t - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [selectedAnswer, timeLeft]);

  // 🔹 Gestion réponse utilisateur
  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);
    setUserResponses(prev => [...prev, answer]);

    if (answer === questions[current].correct) {
      setPoint(prev => prev + 1);
    }
  };

  // 🔹 Passage à la question suivante ou fin du quiz
    const handleNextQuestion = async () => {
        if (current < questions.length - 1) {
            setCurrent(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
      // Envoi des réponses à l'API
        try {
          await fetch(`http://localhost:4000/quiz/${id}/response`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ responses: userResponses }),
          });
        } catch (err) {
          console.error("Erreur API réponses :", err);
        }
        router.push(
          `/quiz/result?score=${point}&total=${questions.length}&questions=${encodeURIComponent(
            JSON.stringify(questions)
          )}&responses=${encodeURIComponent(JSON.stringify(userResponses))}`
        );
    }
  };

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Chargement du quiz...</p>
      </div>
    );
  }

  const currentQuestion = questions[current];

  return (
    <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-md">

        <h1 className="text-2xl font-bold mb-2 text-center text-blue-600">
          Question {current + 1} / {questions.length}
        </h1>

        {/* ⏱️ Chrono */}
        <div className="text-center text-lg font-semibold text-red-500 mb-4">
          ⏱ Temps restant : {timeLeft}s
        </div>

        <h2 className="text-lg font-semibold mb-6 text-gray-800 text-center">
          {currentQuestion.question}
        </h2>

        <div className="flex flex-col gap-3">
          {currentQuestion.answers.map((answer: string, idx: number) => {
            const isCorrect = answer === currentQuestion.correct;
            const isSelected = selectedAnswer === answer;
            const color =
              showExplanation && isSelected
                ? isCorrect
                  ? "success"
                  : "error"
                : "primary";

            return (
              <Button
                key={idx}
                variant="contained"
                color={color as any}
                onClick={() => handleAnswer(answer)}
                disabled={selectedAnswer !== null}
              >
                {answer}
              </Button>
            );
          })}
        </div>
{/* 
        {showExplanation && (
          <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-gray-700">
              <strong>Explication :</strong>{" "}
              {currentQuestion.description_answer || "Aucune explication fournie."}
            </p>
          </div>
        )} */}

        {showExplanation && (
          <div className="mt-6 flex justify-end">
            <Button variant="outlined" color="primary" onClick={handleNextQuestion}>
              {current < questions.length - 1 ? "Question suivante" : "Terminer"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
