"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation.js';

export default function Home() {

    const { id } = useParams();

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(
                    `http://localhost:4000/quiz/${id}`,
                    { headers: { 'Content-Type': "application/json" } }
                );
                if (!res.ok)
                    throw new Error("Error Api questions");
                const data = await res.json();
                console.log(data);
                setQuestions(data);
            } catch (err) {
                console.error("Erreur lors de la récupération des questions:", err);
            }
        };

        fetchQuestion();
    }, []);

    const [current, setCurrent] = useState(0)
    const [point, setPoint] = useState(0);

    const [questions, setQuestions] = useState([
        {
            id: 0,
            question: '',
            answers: [],
            correct: ''
        }
    ]);

    const handleAnswer = (answer: string) => {
        if (answer === questions[current].correct) {
            setPoint(point + 1);
        } else {
            alert('Mauvaise reponse')
        }
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else if (current === questions.length - 1) {
            alert(`Fin du Quiz, vous avez ${point} points`);
            redirect('/quiz');
        }
    };

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <Button variant='contained' href='/'>Home</Button>
            <div className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">{questions[current].question}</h1>
                {questions[current].answers.map((answer, idx) => (
                    <Button
                        key={idx}
                        variant="contained"
                        onClick={() => handleAnswer(answer)}
                    >
                        {answer}
                    </Button>
                ))}
            </div>
        </div>
    );
}
