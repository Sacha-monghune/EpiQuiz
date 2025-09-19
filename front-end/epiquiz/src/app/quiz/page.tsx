"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { questions } from './questions.js';
import { useEffect, useState } from 'react';

export default function Home() {
    const [isClient, setIsClient] = useState(false)
    const [current, setCurrent] = useState(0)


    useEffect(() => {
        setIsClient(true)
    }, [])

    const handleAnswer = (answer: string) => {
        if (answer === questions[current].correct) {
            alert('Bonne reponse')
        } else {
            alert('Mauvaise reponse')
        }
        if (current < questions.length - 1) {
            setCurrent(current + 1);
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
