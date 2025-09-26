"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {

  const [quizzes, setQuizzes] = useState<any[]>([]);

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


  return (
    <div className="font-sans grid items-center justify-items-center min-h-screen p-8 gap-8">
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Liste des Quiz :</h2>
        
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="border p-2 rounded">
            <Button
              component={Link}
              href={`/quiz/${quiz.id}`}
              variant="contained"
              className="w-full"
            >
              {quiz.name}
            </Button>
          </li>
        ))}
      </div>
    </div>
  );
}
