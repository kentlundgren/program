import React, { useState, useEffect } from 'react';
import '../styles/Quiz.css';

/**
 * QuizPage - Visar quiz med frågor
 * Version: 1.1.0
 * 
 * Denna komponent visar ett interaktivt quiz om Röda Korset och flyktingarbete
 * med frågor, svarsalternativ och resultathantering. Användaren måste klara
 * quizet för att få tillgång till lösningssidan.
 * 
 * Här skedde en uppdatering för att implementera en fullständig quiz-funktionalitet 
 * med flera frågor, svarsalternativ, feedback och resultaträkning.
 */
const QuizPage = ({ onQuizPassed }) => {
  // Quiz-frågor med svarsalternativ
  const questions = [
    {
      id: 1,
      text: "Vilket år grundades Röda Korset?",
      options: [
        { id: "a", text: "1859" },
        { id: "b", text: "1863" },
        { id: "c", text: "1901" },
        { id: "d", text: "1918" }
      ],
      correctAnswer: "b",
      explanation: "Röda Korset grundades av Henri Dunant år 1863 efter hans upplevelser vid slaget vid Solferino i Italien."
    },
    {
      id: 2,
      text: "Hur många flyktingar fanns det globalt enligt UNHCR under 2022?",
      options: [
        { id: "a", text: "Cirka 10 miljoner" },
        { id: "b", text: "Cirka 20 miljoner" },
        { id: "c", text: "Cirka 32 miljoner" },
        { id: "d", text: "Cirka 45 miljoner" }
      ],
      correctAnswer: "c",
      explanation: "Enligt UNHCR:s rapport från 2022 fanns det cirka 32,5 miljoner flyktingar globalt, en historiskt hög nivå."
    },
    {
      id: 3,
      text: "Vilka är Röda Korsets sju grundprinciper?",
      options: [
        { id: "a", text: "Humanitet, neutralitet, objektivitet, självständighet, frivillighet, effektivitet, universalitet" },
        { id: "b", text: "Humanitet, opartiskhet, neutralitet, självständighet, frivillighet, enhet, universalitet" },
        { id: "c", text: "Humanitet, solidaritet, neutralitet, självständighet, effektivitet, enhet, objektivitet" },
        { id: "d", text: "Humanitet, opartiskhet, objektivitet, frivillighet, transparens, effektivitet, universalitet" }
      ],
      correctAnswer: "b",
      explanation: "Röda Korsets sju grundprinciper är: humanitet, opartiskhet, neutralitet, självständighet, frivillighet, enhet och universalitet."
    },
    {
      id: 4,
      text: "Vilken av följande organisationer är närmast kopplad till Röda Korset i flyktingarbetet?",
      options: [
        { id: "a", text: "Amnesty International" },
        { id: "b", text: "Läkare Utan Gränser" },
        { id: "c", text: "UNHCR (FN:s flyktingorgan)" },
        { id: "d", text: "Greenpeace" }
      ],
      correctAnswer: "c",
      explanation: "UNHCR (FN:s flyktingorgan) arbetar närmast med Röda Korset i flyktingfrågor, både i flyktingläger och i mottagarländer."
    },
    {
      id: 5,
      text: "Vilket av följande länder har tagit emot flest syriska flyktingar sedan konflikten började?",
      options: [
        { id: "a", text: "Tyskland" },
        { id: "b", text: "Jordanien" },
        { id: "c", text: "Turkiet" },
        { id: "d", text: "Sverige" }
      ],
      correctAnswer: "c",
      explanation: "Turkiet har tagit emot flest syriska flyktingar, med över 3,5 miljoner registrerade syrier sedan konflikten började 2011."
    }
  ];

  // State för att hantera quiz
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Hantera val av svarsalternativ
  const handleAnswerSelect = (optionId) => {
    if (quizSubmitted) return;
    
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = optionId;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  // Gå till nästa fråga
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Gå till föregående fråga
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Beräkna poäng och kontrollera om quizet är godkänt
  const calculateScore = () => {
    let newScore = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        newScore++;
      }
    });
    
    setScore(newScore);
    
    // För att passera quizet krävs minst 60% rätt
    const passingScore = Math.ceil(questions.length * 0.6);
    return newScore >= passingScore;
  };
  
  // Hantera inlämning av quiz
  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const passed = calculateScore();
    setShowResults(true);
    
    if (passed) {
      onQuizPassed();
    }
  };
  
  // Starta om quizet
  const handleRetryQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(questions.length).fill(null));
    setShowResults(false);
    setQuizSubmitted(false);
    setScore(0);
  };
  
  // Beräkna förloppsindikatorns fyllnadsprocent
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;
  
  // Om resultat ska visas, visa dem
  if (showResults) {
    const totalQuestions = questions.length;
    const passingScore = Math.ceil(totalQuestions * 0.6);
    const passed = score >= passingScore;
    
    return (
      <div className="page-container">
        <h1>Quiz Resultat</h1>
        
        <div className="quiz-container">
          <div className="quiz-results">
            <h2 className="results-header">
              {passed 
                ? "Gratulerar! Du har klarat quizet!" 
                : "Tyvärr! Du behöver fler rätta svar."}
            </h2>
            
            <div className="results-score">
              {score} / {totalQuestions}
            </div>
            
            <p className="results-message">
              {passed 
                ? "Du har nu tillgång till lösningsförslagen. Använd dem som stöd i ditt arbete med uppgiften." 
                : `Du behöver minst ${passingScore} rätta svar för att klara quizet. Försök igen!`}
            </p>
            
            {!passed && (
              <button 
                className="retry-button"
                onClick={handleRetryQuiz}
              >
                Försök igen
              </button>
            )}
          </div>
          
          <div className="question-review">
            <h3>Genomgång av frågorna</h3>
            
            {questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`review-question ${
                  selectedAnswers[index] === question.correctAnswer ? "correct" : "incorrect"
                }`}
              >
                <div className="review-question-header">
                  <span className="question-number">{index + 1}</span>
                  <span className="question-text">{question.text}</span>
                </div>
                
                <div className="review-answer">
                  <strong>Ditt svar:</strong> {
                    selectedAnswers[index] 
                      ? question.options.find(opt => opt.id === selectedAnswers[index]).text
                      : "Inget svar"
                  }
                </div>
                
                <div className="review-correct">
                  <strong>Rätt svar:</strong> {
                    question.options.find(opt => opt.id === question.correctAnswer).text
                  }
                </div>
                
                <div className="review-explanation">
                  <strong>Förklaring:</strong> {question.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Visa aktuell fråga
  const currentQuestionData = questions[currentQuestion];
  
  return (
    <div className="page-container">
      <h1>Quiz om Röda Korset och flyktingarbete</h1>
      
      <div className="quiz-container">
        <div className="quiz-progress">
          <span>Fråga {currentQuestion + 1} av {questions.length}</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
          </div>
        </div>
        
        <div className="question-container">
          <div className="question-header">
            <div className="question-number">{currentQuestion + 1}</div>
            <div className="question-text">{currentQuestionData.text}</div>
          </div>
          
          <div className="answer-options">
            {currentQuestionData.options.map((option) => (
              <div 
                key={option.id}
                className={`answer-option ${selectedAnswers[currentQuestion] === option.id ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(option.id)}
              >
                <input 
                  type="radio"
                  id={`option-${option.id}`}
                  name={`question-${currentQuestionData.id}`}
                  checked={selectedAnswers[currentQuestion] === option.id}
                  onChange={() => handleAnswerSelect(option.id)}
                />
                <label htmlFor={`option-${option.id}`} className="answer-text">
                  {option.text}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="quiz-controls">
          <button 
            className="quiz-button quiz-button-prev"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Föregående
          </button>
          
          {currentQuestion < questions.length - 1 ? (
            <button 
              className="quiz-button quiz-button-next"
              onClick={handleNextQuestion}
              disabled={selectedAnswers[currentQuestion] === null}
            >
              Nästa
            </button>
          ) : (
            <button 
              className="quiz-button quiz-button-submit"
              onClick={handleSubmitQuiz}
              disabled={selectedAnswers.some(answer => answer === null)}
            >
              Lämna in
            </button>
          )}
        </div>
        
        {selectedAnswers.some(answer => answer === null) && currentQuestion === questions.length - 1 && (
          <p className="quiz-note">Du måste besvara alla frågor innan du kan lämna in quizet.</p>
        )}
      </div>
    </div>
  );
};

export default QuizPage; 