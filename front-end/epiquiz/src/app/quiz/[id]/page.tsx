"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function Home() {
    const { id } = useParams();
    const router = useRouter();

    const [questions, setQuestions] = useState<any[]>([]);
    const [current, setCurrent] = useState(0);
    const [point, setPoint] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(`http://10.49.84.163:4000/quiz/${id}`);
                if (!res.ok) throw new Error("Erreur API questions");
                const data = await res.json();
                setQuestions(data || []);
            } catch (err) {
                console.error("Erreur lors de la récupération des questions:", err);
            }
        };

        fetchQuestion();
    }, [id]);

    const handleAnswer = (answer: string) => {
        if (selectedAnswer !== null) return;
        setSelectedAnswer(answer);
        setShowExplanation(true);

        if (answer === questions[current].correct) {
            setPoint(prev => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        if (current < questions.length - 1) {
            setCurrent(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        } else {
            // alert(`Fin du quiz ! Vous avez ${point} point${point > 1 ? "s" : ""}.`);
            // router.push("/quiz");
            router.push(`/quiz/result?score=${point}&total=${questions.length}`);
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
    if (!currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg">Aucune question trouvée.</p>
            </div>
        );
    }

    return (
        <div className="font-sans flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="max-w-xl w-full bg-white p-6 rounded-2xl shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
                    Question {current + 1} / {questions.length}
                </h1>
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

                {/* Explication après réponse */}
                {showExplanation && (
                    <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-gray-700">
                            <strong>Explication :</strong>{" "}
                            {currentQuestion.description_answer || "Aucune explication fournie."}
                        </p>
                    </div>
                )}

                {showExplanation && (
                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleNextQuestion}
                        >
                            {current < questions.length - 1 ? "Question suivante" : "Terminer"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
