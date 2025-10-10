"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Update } from '@mui/icons-material';

export default function Quizzes() {
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Pour la création de quiz
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([
    { question: "", answers: ["", ""], correct: "", image: null }
  ]);

  // Ouvre/ferme le dialog
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Ajoute une question
  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", ""], correct: "", image: null }]);
  };

  // Modifie une question/réponse
  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    if (field === "answer") updated[idx].answers = value;
    if (field === "correct") updated[idx].correct = value;
    if (field === "image") updated[idx].image = value;
    setQuestions(updated);
  };

  // Modifie une réponse d'une question
  const handleAnswerChange = (qIdx: number, aIdx: number, value: string) => {
    const updated = [...questions];
    updated[qIdx].answers[aIdx] = value;
    setQuestions(updated);
  };

  // Ajoute une réponse à une question
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

  // Création du quiz
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
            correct: q.correct,
            image: q.image
          }))
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur création quiz");
      handleClose();
      setTitle("");
      setQuestions([{ question: "", answers: ["", ""], correct: "", image: null }]);
      // Optionnel: refresh la liste
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
              <div className="flex flex-col items-start mb-2">
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ textTransform: "none", borderColor: "#1E90FF", color: "#1E90FF" }}
                >
                  {q.image ? "Changer l’image" : "Choisir une image"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleQuestionChange(qIdx, "image", reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
                {q.image && (
                  <div className="mt-3 flex flex-col items-start">
                    <img
                      src={q.image}
                      alt={`Question ${qIdx + 1}`}
                      style={{
                        maxWidth: "150px",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleQuestionChange(qIdx, "image", null)}
                      sx={{ mt: 1 }}
                    >
                      Supprimer l’image
                    </Button>
                  </div>
                )}
              </div>

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