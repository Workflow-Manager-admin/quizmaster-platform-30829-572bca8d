import React, { useState } from 'react';
import './App.css';

/*
  QuizMaster Platform Main Container

  Features:
    - Users: View quizzes, participate/take quiz, instant feedback and results.
    - Admins: Create/manage quizzes, view results dashboard.
    - Simple role toggle for "admin" vs "user" for demo.
*/

// Demo data for quizzes
const demoQuizzes = [
  {
    id: 1,
    title: "General Knowledge",
    questions: [
      {
        text: "What is the capital of France?",
        options: ["Berlin", "Paris", "Madrid", "Rome"],
        answer: 1,
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Venus", "Mars", "Saturn"],
        answer: 2,
      }
    ]
  },
];

function App() {
  // "user" or "admin"
  const [role, setRole] = useState('user');
  // ID of the quiz being taken
  const [activeQuizId, setActiveQuizId] = useState(null);
  // For admins: creating a new quiz
  const [isCreating, setIsCreating] = useState(false);
  // List of all quizzes
  const [quizzes, setQuizzes] = useState([...demoQuizzes]);
  // For quiz taking: answers state and submit result
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  // For admin: storage of all user results
  const [results, setResults] = useState([]);

  // Quiz Creation form state (admin)
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    questions: [
      { text: '', options: ['', '', '', ''], answer: 0 }
    ]
  });

  // Switch between admin/user role
  const toggleRole = () => {
    setRole(role === 'user' ? 'admin' : 'user');
    setActiveQuizId(null);
    setIsCreating(false);
    setUserAnswers([]);
    setQuizSubmitted(false);
  };

  // Handle selecting a quiz
  const handleStartQuiz = (quizId) => {
    setActiveQuizId(quizId);
    setUserAnswers(Array(quizzes.find(q => q.id === quizId).questions.length).fill(null));
    setQuizSubmitted(false);
  };

  // Handle answer selection
  const handleAnswer = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    setUserAnswers(prev =>
      prev.map((ans, i) => (i === questionIndex ? optionIndex : ans))
    );
  };

  // Submit quiz for feedback/result
  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Store in results for admin to view
    setResults(prev => [
      ...prev,
      {
        quizId: activeQuizId,
        answers: [...userAnswers]
      }
    ]);
  };

  // Admin: Create new quiz actions
  const handleNewQuizChange = (field, value) => {
    setNewQuiz((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  // Admin: Add/remove/edit question in quiz draft
  const handleNewQuestionChange = (qIdx, field, value) => {
    setNewQuiz(prev => {
      const questions = prev.questions.map((q, i) =>
        i === qIdx ? { ...q, [field]: value } : q
      );
      return { ...prev, questions };
    });
  };
  const handleNewOptionChange = (qIdx, optIdx, value) => {
    setNewQuiz(prev => {
      const questions = prev.questions.map((q, i) => {
        if (i === qIdx) {
          const options = [...q.options];
          options[optIdx] = value;
          return { ...q, options };
        }
        return q;
      });
      return { ...prev, questions };
    });
  };
  const addQuestionToNewQuiz = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { text: '', options: ['', '', '', ''], answer: 0 }
      ]
    }));
  };
  const removeQuestionFromNewQuiz = (qIdx) => {
    setNewQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== qIdx)
    }));
  };
  const handleCreateQuiz = () => {
    if (!newQuiz.title.trim() || !newQuiz.questions.length) return;
    const newId = quizzes.length ? Math.max(...quizzes.map(q => q.id)) + 1 : 1;
    setQuizzes([...quizzes, { ...newQuiz, id: newId }]);
    setNewQuiz({
      title: '',
      questions: [{ text: '', options: ['', '', '', ''], answer: 0 }]
    });
    setIsCreating(false);
  };

  // Helper: Get quiz by id
  const getQuizById = (id) => quizzes.find(q => q.id === id);

  // Render: Role toggle, nav bar
  return (
    <div className="app">
      {/* Navbar */}
      <nav className="navbar" style={{ backgroundColor: "var(--base-dark)" }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <div className="logo">
              <span className="logo-symbol" style={{ color: "#FFD166" }}>★</span> QuizMaster Platform
            </div>
            <button
              className="btn"
              style={{ background: role === 'admin' ? '#40916C' : '#2D6A4F' }}
              onClick={toggleRole}
            >
              Switch to {role === 'admin' ? 'User' : 'Admin'} mode
            </button>
          </div>
        </div>
      </nav>

      {/* Main content area */}
      <main>
        <div className="container">
          {/* Hero or dashboard block */}
          {!activeQuizId && !isCreating && (
            <div className="hero" style={{ paddingTop: '108px' }}>
              <div className="subtitle" style={{ color: "#40916C" }}>
                {role === "admin" ? "Admin Dashboard" : "Take a Quiz!"}
              </div>
              <h1 className="title">
                {role === "admin"
                  ? "Quiz & Results Management"
                  : "QuizMaster Platform"}
              </h1>
              <div className="description">
                {
                  role === "admin"
                  ? (
                    <>
                      Create, update, and review quizzes. See participant results below, and add new quizzes by clicking "Create Quiz".
                    </>
                  )
                  : (
                    <>
                      Welcome to QuizMaster! Choose a quiz below and see how you score. Feedback is immediate after submission.
                    </>
                  )
                }
              </div>
              {/* Admin: Create Quiz Button */}
              {role === "admin" && (
                <button className="btn btn-large" style={{ background: "#FFD166", color: "#1A1A1A" }} onClick={() => setIsCreating(true)}>
                  + Create Quiz
                </button>
              )}
            </div>
          )}

          {/* Quiz List */}
          {!activeQuizId && !isCreating && (
            <div style={{ margin: '24px 0' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {quizzes.map(quiz => (
                  <div key={quiz.id} style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    padding: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{
                        fontWeight: 600, fontSize: '1.2rem'
                      }}>{quiz.title}</div>
                      <span style={{
                        color: "var(--text-secondary)", fontSize: '0.97rem'
                      }}>
                        {quiz.questions.length} questions
                      </span>
                    </div>
                    <button
                      className="btn"
                      style={{
                        background: "#40916C",
                        minWidth: 100,
                        fontWeight: 500
                      }}
                      onClick={() =>
                        role === "admin"
                          ? setActiveQuizId(quiz.id)
                          : handleStartQuiz(quiz.id)
                      }
                    >
                      {role === "admin" ? "Preview" : "Start"}
                    </button>
                  </div>
                ))}
                {quizzes.length === 0 && (
                  <div>No quizzes yet. {role === "admin" ? "Create one!" : ""}</div>
                )}
              </div>
            </div>
          )}

          {/* Quiz Taking UI */}
          {activeQuizId && role === "user" && (
            <QuizPlayer
              quiz={getQuizById(activeQuizId)}
              answers={userAnswers}
              setAnswer={handleAnswer}
              quizSubmitted={quizSubmitted}
              onSubmit={handleSubmitQuiz}
              onBack={() => { setActiveQuizId(null); setQuizSubmitted(false); }}
            />
          )}

          {/* Quiz Preview for admin */}
          {activeQuizId && role === "admin" && (
            <QuizPreview
              quiz={getQuizById(activeQuizId)}
              onBack={() => setActiveQuizId(null)}
            />
          )}

          {/* Results (submit/feedback for user only) */}
          {activeQuizId && role === "user" && quizSubmitted && (
            <QuizResult
              quiz={getQuizById(activeQuizId)}
              answers={userAnswers}
              onBack={() => { setActiveQuizId(null); setQuizSubmitted(false); }}
            />
          )}

          {/* Admin: Quiz Creation UI */}
          {isCreating && role === 'admin' && (
            <QuizCreator
              newQuiz={newQuiz}
              setNewQuiz={setNewQuiz}
              onChange={handleNewQuizChange}
              onQuestionChange={handleNewQuestionChange}
              onOptionChange={handleNewOptionChange}
              addQuestion={addQuestionToNewQuiz}
              removeQuestion={removeQuestionFromNewQuiz}
              onCancel={() => setIsCreating(false)}
              onCreate={handleCreateQuiz}
            />
          )}

          {/* Admin: Results dashboard */}
          {role === "admin" && !isCreating && (
            <ResultsDashboard quizzes={quizzes} results={results} />
          )}
        </div>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function QuizPlayer({ quiz, answers, setAnswer, quizSubmitted, onSubmit, onBack }) {
  // Focus: one question at a time
  const [step, setStep] = useState(0);
  const total = quiz.questions.length;
  const question = quiz.questions[step];

  // PUBLIC_INTERFACE
  const handleNext = () => {
    if (step < total - 1) setStep(s => s + 1);
  };
  // PUBLIC_INTERFACE
  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  return (
    <div style={{ paddingTop: 108 }}>
      <h2 style={{ color: "#2D6A4F" }}>{quiz.title}</h2>
      <div style={{ margin: "32px auto", background: "#fafafe08", padding: 24, borderRadius: 9, maxWidth: 520 }}>
        <div style={{ fontSize: "1.06rem", marginBottom: 12, fontWeight: 500 }}>
          Question {step + 1} of {total}
        </div>
        <div style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: 20 }}>
          {question.text}
        </div>
        <div>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              className="btn"
              style={{
                background:
                  answers[step] === idx
                    ? "#FFD166"
                    : "#40916C",
                color: answers[step] === idx ? "#1A1A1A" : "#fff",
                marginBottom: 8,
                width: "100%",
                textAlign: "left",
                border: answers[step] === idx ? "2px solid #FFD166" : "none",
                fontWeight: 500,
              }}
              disabled={quizSubmitted}
              onClick={() => setAnswer(step, idx)}
            >
              {opt}
            </button>
          ))}
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
          <button className="btn" style={{ background: "#ADB5BD" }} onClick={onBack}>
            Back to Quizzes
          </button>
          <button className="btn" style={{ background: "#2D6A4F" }} onClick={handleBack} disabled={step === 0}>
            Previous
          </button>
          <button className="btn" style={{ background: "#2D6A4F" }} onClick={handleNext} disabled={step === total - 1}>
            Next
          </button>
          {step === total - 1 && (
            <button
              className="btn"
              style={{ background: "#FFD166", color: "#1A1A1A" }}
              onClick={onSubmit}
              disabled={answers.includes(null) || quizSubmitted}
            >
              Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function QuizResult({ quiz, answers, onBack }) {
  // Score calculation
  const results = quiz.questions.map((q, idx) => {
    return {
      correct: q.answer === answers[idx],
      userAnswer: answers[idx],
      correctAnswer: q.answer,
      question: q.text,
      options: q.options
    };
  });
  const score = results.filter(r => r.correct).length;

  return (
    <div style={{ paddingTop: 108, textAlign: "center" }}>
      <h2 style={{ color: "#2D6A4F" }}>Quiz Results</h2>
      <div className="description" style={{ marginBottom: 32 }}>
        You scored {score} out of {quiz.questions.length}
      </div>
      <div style={{
        maxWidth: 600,
        margin: "0 auto",
        background: "#fafafe08",
        padding: 22,
        borderRadius: 9,
        textAlign: "left"
      }}>
        {results.map((res, idx) => (
          <div key={idx} style={{ marginBottom: 20, borderBottom: "1px solid #dedede11", paddingBottom: 8 }}>
            <div style={{ fontWeight: 600 }}>{idx + 1}. {res.question}</div>
            <div>
              <span style={{
                color: res.correct ? "#40916C" : "#E46464",
                fontWeight: 500
              }}>
                {res.correct
                  ? "✅ Correct!"
                  : <>❌ Your answer: <b>{res.options[res.userAnswer] || <i>Not answered</i>}</b></>
                }
              </span>
              {!res.correct && <div>Correct answer: <b>{res.options[res.correctAnswer]}</b></div>}
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-large" style={{ marginTop: 24 }} onClick={onBack}>
        Back to Quizzes
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function QuizPreview({ quiz, onBack }) {
  return (
    <div style={{ paddingTop: 108 }}>
      <h2 style={{ color: "#40916C" }}>Preview: {quiz.title}</h2>
      <div style={{
        maxWidth: 650,
        margin: "0 auto",
        background: "#fafafe08",
        padding: 30,
        borderRadius: 9
      }}>
        {quiz.questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 30 }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>
              {i + 1}. {q.text}
            </div>
            <ul style={{ paddingLeft: 18 }}>
              {q.options.map((opt, j) => (
                <li
                  key={j}
                  style={{
                    color: j === q.answer ? "#FFD166" : "#fff",
                    fontWeight: j === q.answer ? 600 : 400,
                  }}
                >
                  {opt}
                  {j === q.answer && ' (correct answer)'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button className="btn btn-large" style={{ marginTop: 18 }} onClick={onBack}>
        Back to Dashboard
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
function QuizCreator({
  newQuiz,
  onChange,
  onQuestionChange,
  onOptionChange,
  addQuestion,
  removeQuestion,
  onCancel,
  onCreate
}) {
  return (
    <div style={{ paddingTop: 108, maxWidth: 700, margin: '0 auto' }}>
      <h2 style={{ color: "#40916C" }}>Create New Quiz</h2>
      <div style={{
        background: "#fafafe12",
        padding: 24,
        borderRadius: 10,
        marginTop: 18
      }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontWeight: 600 }}>
            Quiz Title:
            <input
              type="text"
              value={newQuiz.title}
              onChange={e => onChange('title', e.target.value)}
              placeholder="Enter quiz title"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 4,
                marginTop: 4,
                fontSize: "1.1rem",
                border: "1px solid #DDD"
              }}
            />
          </label>
        </div>
        {newQuiz.questions.map((q, qIdx) => (
          <div key={qIdx} style={{
            background: "#fff2",
            padding: 16,
            borderRadius: 6,
            marginBottom: 16,
            position: "relative"
          }}>
            <label style={{ fontWeight: 500 }}>
              Question {qIdx + 1}:
              <input
                type="text"
                value={q.text}
                onChange={e => onQuestionChange(qIdx, 'text', e.target.value)}
                placeholder="Enter question text"
                style={{
                  width: "100%",
                  padding: "7px",
                  borderRadius: 4,
                  marginTop: 4,
                  fontSize: "1rem",
                  border: "1px solid #CCC"
                }}
              />
            </label>
            <div style={{ marginTop: 12 }}>
              Options:
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} style={{ marginBottom: 5 }}>
                  <label>
                    <input
                      type="radio"
                      name={`correct${qIdx}`}
                      checked={q.answer === optIdx}
                      onChange={() =>
                        onQuestionChange(qIdx, 'answer', optIdx)
                      }
                      style={{ marginRight: 4 }}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => onOptionChange(qIdx, optIdx, e.target.value)}
                      placeholder={`Option ${optIdx + 1}`}
                      style={{
                        padding: "7px",
                        borderRadius: 4,
                        fontSize: "1rem",
                        border: "1px solid #CCC"
                      }}
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        className="btn"
                        style={{
                          marginLeft: 8,
                          background: "#AAA",
                          color: "#fff",
                          padding: "4px 10px"
                        }}
                        onClick={() => {
                          if(q.options.length > 2) {
                            onOptionChange(qIdx, optIdx, '');
                            let removedOpt = [...q.options];
                            removedOpt.splice(optIdx, 1);
                            onQuestionChange(qIdx, 'options', removedOpt);
                          }
                        }}
                        tabIndex={-1}
                      >
                        Remove
                      </button>
                    )}
                  </label>
                </div>
              ))}
              {q.options.length < 6 && (
                <button
                  type="button"
                  className="btn"
                  style={{ fontSize: "0.97rem", background: "#FFD166", marginTop: 4, color: "#222" }}
                  onClick={() =>
                    onQuestionChange(qIdx, 'options', [...q.options, ''])
                  }
                >
                  + Add Option
                </button>
              )}
            </div>
            {newQuiz.questions.length > 1 && (
              <button
                type="button"
                className="btn"
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#E46464",
                  color: "#fff",
                  fontSize: "0.95rem",
                  padding: "3px 7px"
                }}
                onClick={() => removeQuestion(qIdx)}
              >
                Remove Q
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          className="btn"
          style={{ background: "#40916C", color: "#fff" }}
          onClick={addQuestion}
        >
          + Add Question
        </button>
        <div style={{ display: "flex", gap: 10, marginTop: 28 }}>
          <button className="btn btn-large" style={{ background: "#FFD166", color: "#222" }} onClick={onCreate}>
            Create Quiz
          </button>
          <button className="btn btn-large" style={{ background: "#AAA" }} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function ResultsDashboard({ quizzes, results }) {
  // Map quiz id to results
  const quizResults = quizzes.map(q => ({
    ...q,
    attempts: results.filter(r => r.quizId === q.id)
  }));

  return (
    <div style={{ marginTop: 36 }}>
      <h3 style={{ color: "#2D6A4F" }}>Results Dashboard</h3>
      {quizResults.map(qr => (
        <div key={qr.id} style={{
          background: "rgba(255,255,255,0.02)",
          margin: "18px 0",
          padding: 18,
          borderRadius: 7,
          border: '1px solid var(--border-color)'
        }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
            {qr.title}
            <span style={{ fontWeight: 400, fontSize: "0.97rem", color: "#aaa", marginLeft: 6 }}>
              ({qr.attempts.length} attempt{qr.attempts.length === 1 ? '' : 's'})
            </span>
          </div>
          {qr.attempts.length === 0 ? (
            <div style={{ color: "#999", marginTop: 4 }}>No results yet.</div>
          ) : (
            <div style={{ marginTop: 8 }}>
              {qr.attempts.map((att, ai) => {
                const score = qr.questions.filter((q, i) => att.answers[i] === q.answer).length;
                return (
                  <div key={ai} style={{
                    borderBottom: "1px solid #ddd1",
                    paddingBottom: 5,
                    marginBottom: 2,
                    color: "#222"
                  }}>
                    <b>Attempt {ai + 1}:</b> Score: {score} / {qr.questions.length}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
