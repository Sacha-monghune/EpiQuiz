"use client";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Play,
  ImagePlus,
  CirclePlus,
  BookOpen,
} from "lucide-react";

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
    { question: "", answers: ["", ""], correct: "", image: null, description_answer: "", timer: 30 }

  ]);
  const [editId, setEditId] = React.useState<number | null>(null);
  const [search, setSearch] = React.useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditId(null);
    setTitle("");
    setQuestions([{ question: "", answers: ["", ""], correct: "", description_answer: "", image: null, timer: 30 }]);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answers: ["", ""], correct: "", description_answer: "", image: null, timer: 30 }]);
  };

  const handleQuestionChange = (idx: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") updated[idx].question = value;
    if (field === "answer") updated[idx].answers = value;
    if (field === "correct") updated[idx].correct = value;
    if (field === "image") updated[idx].image = value;
    if (field === "description_answer") updated[idx].description_answer = value;
    if (field === "timer") updated[idx].timer = value;
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
            timer: q.timer
          }))
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur création quiz");
      handleClose();
      setTitle("");
      setQuestions([{ question: "", answers: ["", ""], correct: "", image: null, description_answer: "", timer: 30 }]);
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
            timer: q.timer
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
  <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 font-sans">

    {/* CONTAINER PRINCIPAL */}
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen size={28} /> Gestion des Quiz
        </h2>

        <div className="flex gap-3 items-center w-full sm:w-auto">
          <TextField
            label={
              <span className="flex items-center gap-2">
                <Search size={16} /> Rechercher un quiz
              </span>
            }
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              backgroundColor: "white",
              borderRadius: "8px",
              width: "240px",
            }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1E90FF",
              color: "white",
              px: 2.5,
              py: 1,
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            onClick={handleOpen}
          >
            <Plus size={18} /> Nouveau quiz
          </Button>
        </div>
      </div>

      {/* GRILLE DES QUIZ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-semibold text-blue-600 mb-1">
                {quiz.name}
              </h3>
              <p className="text-sm text-gray-500">
                {quiz.questions?.length || 0} question
                {quiz.questions?.length > 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <Button
                variant="contained"
                size="small"
                sx={{ borderRadius: "8px", display: "flex", gap: "6px" }}
                onClick={() => handleGoQuiz(quiz.id)}
              >
                <Play size={16} /> Lancer le quiz
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: "8px", display: "flex", gap: "6px" }}
                  onClick={() => handleEditQuiz(quiz)}
                >
                  <Pencil size={16} /> Modifier
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  color="error"
                  sx={{ borderRadius: "8px", display: "flex", gap: "6px" }}
                  onClick={() => handleDeleteQuiz(quiz.id)}
                >
                  <Trash2 size={16} /> Supprimer
                </Button>
              </div>
            </div>
          </div>
        ))}

        {quizzes.length === 0 && (
          <p className="col-span-full text-center text-gray-500 mt-6">
            Aucun quiz trouvé.
          </p>
        )}
      </div>
    </div>

    {/* MODAL FORMULAIRE */}
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-xl font-bold flex items-center gap-2">
        {editId ? (
          <>
            <Pencil size={20} /> Modifier le quiz
          </>
        ) : (
          <>
            <Plus size={20} /> Créer un nouveau quiz
          </>
        )}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: "#F9FAFB" }}>
        {/* TITRE */}
        <div className="mb-6">
          <TextField
            label="Titre du quiz"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* LISTE DES QUESTIONS */}
        <div className="space-y-8">
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="bg-white rounded-2xl border-3 border-gray-200 shadow-sm p-5"
            >
              <h3 className="font-bold text-lg mb-4">Question {qIdx + 1}</h3>

              <TextField
                label="Intitulé"
                fullWidth
                value={q.question}
                sx={{ mb: 3 }}
                onChange={(e) =>
                  handleQuestionChange(qIdx, "question", e.target.value)
                }
              />

              <TextField
                label="Temps (secondes)"
                type="number"
                fullWidth
                sx={{ mb: 3 }}
                value={q.timer}
                onChange={(e) =>
                  handleQuestionChange(qIdx, "timer", Number(e.target.value))
                }
              />

              {/* IMAGE */}
              <div className="mb-4">
                <Button
                  variant="outlined"
                  component="label"
                  sx={{ borderRadius: "10px", display: "flex", gap: "6px" }}
                >
                  <ImagePlus size={16} />
                  {q.image ? "Changer l’image" : "Ajouter une image"}

                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        handleQuestionChange(qIdx, "image", reader.result);
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </Button>

                {q.image && (
                  <div className="mt-3">
                    <img
                      src={q.image}
                      alt="Question"
                      className="max-w-[150px] rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* RÉPONSES */}
              <div className="space-y-3">
                {q.answers.map((ans, aIdx) => (
                  <div key={aIdx} className="flex items-center gap-3">
                    <TextField
                      label={`Réponse ${aIdx + 1}`}
                      fullWidth
                      value={ans}
                      onChange={(e) =>
                        handleAnswerChange(qIdx, aIdx, e.target.value)
                      }
                    />
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={`correct-${qIdx}`}
                        checked={q.correct === ans}
                        onChange={() =>
                          handleQuestionChange(qIdx, "correct", ans)
                        }
                      />
                      Correcte
                    </label>
                  </div>
                ))}
              </div>

              <Button
                size="small"
                onClick={() => addAnswer(qIdx)}
                sx={{ mt: 1, display: "flex", gap: "6px" }}
              >
                <CirclePlus size={16} /> Ajouter une réponse
              </Button>

              <TextField
                label="Explication"
                multiline
                rows={3}
                fullWidth
                className="mt-4"
                value={q.description_answer}
                onChange={(e) =>
                  handleQuestionChange(qIdx, "description_answer", e.target.value)
                }
              />
            </div>
          ))}

          <Button onClick={addQuestion} sx={{ display: "flex", gap: "6px" }}>
            <CirclePlus size={18} /> Ajouter une question
          </Button>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Annuler</Button>

        <Button variant="contained" onClick={editId ? handleUpdateQuiz : handleCreateQuiz}>
          {editId ? "Sauvegarder" : "Créer"}
        </Button>
      </DialogActions>
    </Dialog>
  </div>
);

}