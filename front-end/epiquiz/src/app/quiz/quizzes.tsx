"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/quiz",
          { headers: { "Content-Type": "application/json" } }
        );
        if (!res.ok)
          throw new Error("Erreur API");
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des quiz:", err);
      }
    };

    fetchQuizzes();
  }, []);

  const handleCreateRoom = async (quiz: any) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: `${quiz.name}`, quiz: quiz}),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur création room");
      const room = await res.json();
      // Redirige vers la room nouvellement créée (ex: /room/:id)
      window.location.href = `/room/${room.id}`;
    } catch (err) {
      alert("Impossible de créer la room");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen">
      <h2 className="font-bold">Liste des Quiz :</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="border p-2 rounded">
            <Button
              variant="contained"
              className="w-full"
              onClick={() => handleCreateRoom(quiz)}
              disabled={loading}
            >
              {loading ? "Création..." : `Créer une room pour "${quiz.name}"`}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}