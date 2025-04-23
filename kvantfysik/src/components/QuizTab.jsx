// Fil: QuizTab.jsx
// Komponent som hanterar quiz-delen av applikationen

import React, { useState } from 'react';

const QuizTab = ({ onQuizComplete }) => {
  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null
  });

  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 'q1',
      question: 'Vad är tunnlingseffekten?',
      options: [
        'När en partikel passerar genom en potentialbarriär trots att den inte har tillräckligt med energi',
        'När en partikel studsar mot en potentialbarriär',
        'När en partikel absorberas av en potentialbarriär',
        'När en partikel förstärks av en potentialbarriär'
      ],
      correct: 0
    },
    {
      id: 'q2',
      question: 'Vad är transmissionskoefficienten?',
      options: [
        'Sannolikheten att en partikel passerar genom barriären',
        'Hastigheten hos partikeln',
        'Energin hos partikeln',
        'Massan hos partikeln'
      ],
      correct: 0
    },
    {
      id: 'q3',
      question: 'Vad händer med transmissionskoefficienten om barriärens bredd ökar?',
      options: [
        'Den ökar exponentiellt',
        'Den minskar exponentiellt',
        'Den förblir konstant',
        'Den ökar linjärt'
      ],
      correct: 1
    }
  ];

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const checkAnswers = () => {
    const allCorrect = questions.every(q => answers[q.id] === q.correct);
    if (allCorrect) {
      onQuizComplete();
    }
    setShowResults(true);
  };

  return (
    <div className="quiz-container">
      <h2>Quiz om tunnlingseffekten</h2>
      
      {questions.map((q) => (
        <div key={q.id} className="question-container">
          <h3>{q.question}</h3>
          <div className="options-container">
            {q.options.map((option, index) => (
              <label key={index} className="option-label">
                <input
                  type="radio"
                  name={q.id}
                  value={index}
                  checked={answers[q.id] === index}
                  onChange={() => handleAnswer(q.id, index)}
                />
                {option}
              </label>
            ))}
          </div>
          {showResults && (
            <div className={`feedback ${answers[q.id] === q.correct ? 'correct' : 'incorrect'}`}>
              {answers[q.id] === q.correct ? 'Rätt!' : 'Fel!'}
            </div>
          )}
        </div>
      ))}

      <button 
        className="check-answers-button"
        onClick={checkAnswers}
        disabled={Object.values(answers).some(a => a === null)}
      >
        Kontrollera svar
      </button>
    </div>
  );
};

export default QuizTab; 