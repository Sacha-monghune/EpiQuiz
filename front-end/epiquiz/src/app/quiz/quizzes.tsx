"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function Quizzes() {
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([
    { question: "", answers: ["", ""], correct: "" }
  ]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", ""], correct: "" }]);
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    if (field === "answer") updated[idx].answers = value;
    if (field === "correct") updated[idx].correct = value;
    setQuestions(updated);
  };

  const handleAnswerChange = (qIdx: number, aIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].answers[aIdx] = value;
    setQuestions(updated);
  };

  const addAnswer = (qIdx: number) => {
    const updated = [...questions];
    updated[qIdx].answers.push("");
    setQuestions(updated);
  };

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
      window.location.href = `/room/${room.id}`;
    } catch (err) {
      alert("Impossible de créer la room");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    setLoading(true);
    try {
      console.log({ title, questions });
      const res = await fetch("http://localhost:4000/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          questions: questions.map(q => ({
            question: q.question,
            answers: q.answers,
            correct: q.correct
          }))
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur création quiz");
      handleClose();
      setTitle("");
      setQuestions([{ question: "", answers: ["", ""], correct: "" }]);
      const data = await res.json();
      setQuizzes([...quizzes, data]);
    } catch (err) {
      alert("Impossible de créer le quiz");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
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
    <div className="font-sans grid items-center justify-items-center min-h-screen">
      <h2 className="font-bold">Liste des Quiz :</h2>
      <Button variant="contained" onClick={handleOpen} sx={{ backgroundColor: "#1E90FF", color: "white" }} className="mb-4">
        Créer un quiz
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Créer un quiz</DialogTitle>
        <DialogContent>
          <TextField
            label="Titre du quiz"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-4"
          />
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="mb-4 border p-2 rounded">
              <TextField
                label={`Question ${qIdx + 1}`}
                fullWidth
                value={q.question}
                onChange={e => handleQuestionChange(qIdx, "question", e.target.value)}
                className="mb-2"
              />
              {q.answers.map((ans, aIdx) => (
                <div key={aIdx} className="flex items-center gap-2 mb-1">
                  <TextField
                  label={`Réponse ${aIdx + 1}`}
                  value={ans}
                  onChange={e => handleAnswerChange(qIdx, aIdx, e.target.value)}
                  />
                  <input
                  type="radio"
                  name={`correct-${qIdx}`}
                  checked={q.correct === ans}
                  onChange={() => handleQuestionChange(qIdx, "correct", ans)}
                  />
                  <span>Bonne réponse</span>
                </div>
              ))}
              <Button size="small" onClick={() => addAnswer(qIdx)}>
                Ajouter une réponse
              </Button>
            </div>
          ))}
          <Button size="small" onClick={addQuestion}>
            Ajouter une question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button onClick={handleCreateQuiz} disabled={loading || !title}>
            {loading ? "Création..." : "Créer"}
          </Button>
        </DialogActions>
      </Dialog>
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