"use client";

import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Update } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

export default function Quizzes() {
  const router = useRouter();
  const [quizzes, setQuizzes] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [questions, setQuestions] = React.useState([
    { question: "", answers: ["", ""], correct: "", image: null, description_answer: "" }
  ]);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setTitle("");
    setQuestions([{ question: "", answers: ["", ""], correct: "", description_answer: "", image: null }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", ""], correct: "", description_answer: "", image: null }]);
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    if (field === "answer") updated[idx].answers = value;
    if (field === "correct") updated[idx].correct = value;
    if (field === "image") updated[idx].image = value;
    if (field === "description_answer") updated[idx].description_answer = value;
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
            correct: q.correct,
            image: q.image,
            description_answer: q.description_answer,
          }))
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur création quiz");
      handleClose();
      setTitle("");
      setQuestions([{ question: "", answers: ["", ""], correct: "", image: null, description_answer: "" }]);
      // Optionnel: refresh la liste
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

    const delay = setTimeout(() => {
      fetchQuizzes();
    }, 300);

    return () => clearTimeout(delay);
  }, [search]);

  const handleEditQuiz = (quiz: any) => {
    setEditId(quiz.id);
    setTitle(quiz.name);
    setQuestions(Array.isArray(quiz.questions) ? quiz.questions : [
      { question: "", answers: ["", ""], correct: "", description_answer: "" }
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
            correct: q.correct,
            description_answer: q.description_answer,
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

              {/* 🧠 Explication de la réponse */}
              <TextField
                label="Explication de la bonne réponse"
                value={q.description_answer}
                onChange={e => handleQuestionChange(qIdx, "description_answer", e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Expliquez pourquoi cette réponse est correcte."
                className="mt-4"
              />

              <Button size="small" onClick={() => addAnswer(qIdx)} className="mt-2">
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
