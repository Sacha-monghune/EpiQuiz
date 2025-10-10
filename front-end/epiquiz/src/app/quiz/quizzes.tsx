"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';

export default function Quizzes() {
  const router = useRouter();
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([
    { question: "", answers: ["", ""], correct: "" }
  ]);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setTitle("");
    setQuestions([{ question: "", answers: ["", ""], correct: "" }]);
  };

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

  const handleGoQuiz = (id: number) => {
    router.push(`/quiz/${id}`);
  };

  const handleCreateQuiz = async () => {
    setLoading(true);
    try {
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
      const data = await res.json();
      setQuizzes([...quizzes, data]);
      handleClose();
    } catch {
      alert("Impossible de créer le quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (id: number) => {
    if (!window.confirm("Supprimer ce quiz ?")) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/quiz/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur suppression quiz");
      setQuizzes(quizzes.filter(q => q.id !== id));
    } catch {
      alert("Impossible de supprimer le quiz");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const url = search
          ? `http://localhost:4000/quiz?search=${encodeURIComponent(search)}`
          : "http://localhost:4000/quiz";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();
        setQuizzes(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des quiz:", err);
      }
    };

    // petit délai pour éviter trop d’appels
    const delay = setTimeout(() => {
      fetchQuizzes();
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleEditQuiz = (quiz: any) => {
    setEditId(quiz.id);
    setTitle(quiz.name);
    setQuestions(Array.isArray(quiz.questions) ? quiz.questions : [
      { question: "", answers: ["", ""], correct: "" }
    ]);
    setOpen(true);
  };

  const handleUpdateQuiz = async () => {
    if (editId === null) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/quiz/${editId}`, {
        method: "PUT",
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
      if (!res.ok) throw new Error("Erreur modification quiz");
      const updated = await res.json();
      setQuizzes(quizzes.map(q => q.id === updated.id ? updated : q));
      handleClose();
    } catch {
      alert("Impossible de modifier le quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Liste des Quiz</h2>
          <div className="flex gap-3 items-center w-full sm:w-auto">
            {/* 🔍 Barre de recherche */}
            <TextField
              label="Rechercher un quiz"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ flex: 1, minWidth: "200px" }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#1E90FF", color: "white" }}
              onClick={handleOpen}
            >
              + Créer un quiz
            </Button>
          </div>
        </div>

        {/* Liste des quiz */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="p-4 border rounded-xl shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-blue-500">{quiz.name}</h3>
                <p className="text-sm text-gray-500">
                  {quiz.questions?.length || 0} question{quiz.questions?.length > 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleGoQuiz(quiz.id)}
                >
                  Lancer le quiz
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleEditQuiz(quiz)}
                  >
                    Éditer
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {quizzes.length === 0 && (
            <p className="col-span-full text-center text-gray-500 mt-6">Aucun quiz disponible.</p>
          )}
        </div>
      </div>

      {/* Dialogue de création / édition */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editId ? "Modifier le quiz" : "Créer un quiz"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Titre du quiz"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-4"
          />
          {Array.isArray(questions) && questions.map((q, qIdx) => (
            <div key={qIdx} className="mb-6 border p-4 rounded-xl bg-gray-50">
              <TextField
                label={`Question ${qIdx + 1}`}
                fullWidth
                value={q.question}
                onChange={e => handleQuestionChange(qIdx, "question", e.target.value)}
                className="mb-3"
              />
              {q.answers.map((ans, aIdx) => (
                <div key={aIdx} className="flex items-center gap-3 mb-2">
                  <TextField
                    label={`Réponse ${aIdx + 1}`}
                    value={ans}
                    onChange={e => handleAnswerChange(qIdx, aIdx, e.target.value)}
                    fullWidth
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correct === ans}
                      onChange={() => handleQuestionChange(qIdx, "correct", ans)}
                    />
                    Bonne
                  </label>
                </div>
              ))}
              <Button size="small" onClick={() => addAnswer(qIdx)}>
                + Ajouter une réponse
              </Button>
            </div>
          ))}
          <Button size="small" onClick={addQuestion}>
            + Ajouter une question
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            onClick={editId ? handleUpdateQuiz : handleCreateQuiz}
            disabled={loading || !title}
            variant="contained"
          >
            {loading
              ? (editId ? "Modification..." : "Création...")
              : (editId ? "Modifier" : "Créer")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
