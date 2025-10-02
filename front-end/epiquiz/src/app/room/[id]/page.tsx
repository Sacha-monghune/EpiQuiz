"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:4000"); // adapte l'URL selon ton back

export default function Room() {
    const router = useRouter();
    const { id } = useParams();
    const [room, setRoom] = useState<any>(null);

    // Récupère la room et son quiz
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`http://localhost:4000/room/${id}`);
                if (!res.ok) throw new Error("Erreur API");
                const data = await res.json();
                setRoom(data);
            } catch (err) {
                console.error("Erreur lors de la récupération de la room:", err);
            }
        };
        fetchRoom();
    }, [id]);

    useEffect(() => {
        socket.emit("joinRoom", id); // chaque user rejoint la room socket

        socket.on("startQuiz", (roomId: string) => {
            console.log(room.quiz)
            if (roomId == id) {
                router.push(`/quiz/${room?.quiz?.id}`);
            }
        });

        return () => {
            socket.off("startQuiz");
        };
    }, [id, router, room]);

    const handleStartQuiz = () => {
        socket.emit("startQuiz", id); // le host lance le quiz pour tous
    };

    return (
        <div className="font-sans grid items-center justify-items-center min-h-screen p-8 gap-8">
            <h2 className="font-bold">Room Page</h2>
            {room && room.quiz && (
                <div>
                    <p>Quiz de la room : <span className="font-semibold">{room.quiz.name}</span></p>
                </div>
            )}
            <Button
                variant="contained"
                color="primary"
                onClick={handleStartQuiz}
            >
                Lancer le quiz pour tous
            </Button>
        </div>
    );
}