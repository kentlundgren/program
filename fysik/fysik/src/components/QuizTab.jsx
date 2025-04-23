// QuizTab.jsx - Interaktivt quiz för att testa elevens förståelse
import React, { useState } from 'react';

// QuizTab tar emot en callback som anropas när quizet är klart
const QuizTab = ({ onQuizComplete }) => {
  // Quiz-frågorna med svarsalternativ och det rätta svaret
  const questions = [
    {
      question: "Vad är den totala resistansen i en parallellkoppling av resistorerna 10Ω och 5Ω?",
      options: [
        "15Ω", 
        "5Ω", 
        "3.33Ω", 
        "2.5Ω"
      ],
      correctAnswer: 2 // Index för det rätta svaret (0-baserat)
    },
    {
      question: "Enligt Ohms lag, vad händer med strömstyrkan om spänningen dubbleras och resistansen hålls konstant?",
      options: [
        "Den förblir oförändrad", 
        "Den halveras", 
        "Den dubbleras", 
        "Den fyrdubblas"
      ],
      correctAnswer: 2
    },
    {
      question: "I en seriekoppling, hur förhåller sig spänningsfallen över resistorerna till varandra?",
      options: [
        "Alla resistorer har samma spänningsfall", 
        "Spänningsfallet är proportionellt mot resistansen", 
        "Spänningsfallet är omvänt proportionellt mot resistansen", 
        "Spänningsfallet beror inte på resistansen"
      ],
      correctAnswer: 1
    }
  ];

  // State för att hålla reda på valda svar
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  
  // State för att visa resultat
  const [showResults, setShowResults] = useState(false);
  
  // State för att hålla reda på om quizet är slutfört med alla rätta svar
  const [isCompleted, setIsCompleted] = useState(false);

  // Funktion för att hantera när användaren väljer ett svar
  const handleOptionSelect = (questionIndex, optionIndex) => {
    // Skapa en kopia av de nuvarande svaren
    const newAnswers = [...selectedAnswers];
    // Uppdatera svaret för den aktuella frågan
    newAnswers[questionIndex] = optionIndex;
    // Uppdatera state
    setSelectedAnswers(newAnswers);
  };

  // Funktion för att kontrollera svaren
  const checkAnswers = () => {
    // Kontrollera att alla frågor har svar
    const allAnswered = selectedAnswers.every(answer => answer !== null);
    
    if (allAnswered) {
      // Kontrollera om alla svar är korrekta
      const allCorrect = questions.every((question, index) => 
        selectedAnswers[index] === question.correctAnswer
      );
      
      // Uppdatera state för att visa resultat
      setShowResults(true);
      
      // Om alla svar är korrekta, markera quizet som klart
      if (allCorrect) {
        setIsCompleted(true);
        // Anropa callback-funktionen från föräldrakomponenten
        onQuizComplete();
      }
    } else {
      // Om inte alla frågor är besvarade, visa en alert
      alert("Vänligen besvara alla frågor innan du kontrollerar dina svar.");
    }
  };

  // Funktion för att återställa quizet
  const resetQuiz = () => {
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResults(false);
  };

  return (
    <div className="quiz-container">
      <h2>Quiz: Testa dina kunskaper</h2>
      <p>Besvara alla frågor korrekt för att låsa upp lösningsfliken.</p>
      
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <h3>Fråga {qIndex + 1}: {q.question}</h3>
          
          <div className="quiz-options">
            {q.options.map((option, oIndex) => (
              <div 
                key={oIndex} 
                className={`quiz-option ${selectedAnswers[qIndex] === oIndex ? 'selected' : ''} ${
                  showResults && oIndex === q.correctAnswer ? 'correct' : ''
                } ${
                  showResults && selectedAnswers[qIndex] === oIndex && oIndex !== q.correctAnswer ? 'incorrect' : ''
                }`}
                onClick={() => !showResults && handleOptionSelect(qIndex, oIndex)}
              >
                <label>
                  <input 
                    type="radio" 
                    name={`question-${qIndex}`} 
                    checked={selectedAnswers[qIndex] === oIndex}
                    onChange={() => !showResults && handleOptionSelect(qIndex, oIndex)}
                    disabled={showResults}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          
          {/* Visa förklaring om resultat visas */}
          {showResults && (
            <div className="answer-explanation">
              {selectedAnswers[qIndex] === q.correctAnswer ? (
                <p className="correct-message">✓ Korrekt svar!</p>
              ) : (
                <p className="incorrect-message">
                  ✗ Fel svar. Rätt svar är: {q.options[q.correctAnswer]}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
      
      <div className="quiz-actions">
        {!showResults ? (
          <button className="quiz-button" onClick={checkAnswers}>
            Kontrollera svar
          </button>
        ) : !isCompleted ? (
          <div>
            <p className="quiz-message">
              Du har inte svarat rätt på alla frågor. Försök igen!
            </p>
            <button className="quiz-button" onClick={resetQuiz}>
              Försök igen
            </button>
          </div>
        ) : (
          <div>
            <p className="quiz-message">
              Bra jobbat! Du har svarat rätt på alla frågor. Lösningsfliken är nu upplåst.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTab;