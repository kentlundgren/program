/*
 * Filnamn: Quiz.jsx
 * Beskrivning: Komponent för quizfrågor om klimatscenarier
 */

import { useState } from 'react';
import { 
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Button,
  Alert,
  Paper
} from '@mui/material';

const questions = [
  {
    question: "Vilket av följande är INTE en av IPCC:s huvudsakliga utsläppsscenarier (RCP)?",
    options: ["RCP 2.6", "RCP 4.5", "RCP 5.0", "RCP 8.5"],
    correct: 2, // RCP 5.0 finns inte
    explanation: "IPCC använder RCP 2.6, 4.5, 6.0 och 8.5. RCP 5.0 existerar inte."
  },
  {
    question: "Vilken global temperaturökning siktar Parisavtalet på att begränsa till?",
    options: ["1.0°C", "1.5°C", "2.0°C", "2.5°C"],
    correct: 1, // 1.5°C
    explanation: "Parisavtalet syftar till att begränsa den globala uppvärmningen till 1.5°C över förindustriella nivåer."
  },
  {
    question: "Vilket årtionde förväntas vi nå 1.5°C uppvärmning enligt IPCC:s senaste rapport om nuvarande trender fortsätter?",
    options: ["2020-talet", "2030-talet", "2040-talet", "2050-talet"],
    correct: 1, // 2030-talet
    explanation: "Enligt IPCC:s senaste rapport förväntas vi nå 1.5°C uppvärmning under 2030-talet om nuvarande trender fortsätter."
  }
];

function Quiz({ onQuizComplete }) {
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleAnswer = (questionIndex, value) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = parseInt(value);
    setAnswers(newAnswers);
    setShowError(false);
    setSubmitted(false);
    setShowExplanations(false);
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      setShowError(true);
      return;
    }

    const correct = answers.reduce((count, answer, index) => 
      answer === questions[index].correct ? count + 1 : count, 0
    );
    
    setCorrectAnswers(correct);
    setSubmitted(true);
    setShowExplanations(true);

    if (correct === questions.length) {
      onQuizComplete(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
      {questions.map((q, index) => (
        <Paper key={index} sx={{ mb: 4, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {`Fråga ${index + 1}: ${q.question}`}
          </Typography>
          <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
            <RadioGroup
              value={answers[index] === null ? '' : answers[index].toString()}
              onChange={(e) => handleAnswer(index, e.target.value)}
            >
              {q.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={optIndex.toString()}
                  control={<Radio />}
                  label={option}
                  sx={{
                    ...(submitted && {
                      color: optIndex === q.correct ? 'success.main' : 
                             answers[index] === optIndex ? 'error.main' : 'inherit'
                    })
                  }}
                />
              ))}
            </RadioGroup>
            {submitted && showExplanations && (
              <Alert 
                severity={answers[index] === q.correct ? "success" : "error"}
                sx={{ mt: 1 }}
              >
                {q.explanation}
              </Alert>
            )}
          </FormControl>
        </Paper>
      ))}

      {showError && !submitted && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Vänligen svara på alla frågor innan du kontrollerar svaren.
        </Alert>
      )}

      {submitted && (
        <Alert 
          severity={correctAnswers === questions.length ? "success" : "info"} 
          sx={{ mb: 2 }}
        >
          Du fick {correctAnswers} av {questions.length} rätt!
          {correctAnswers === questions.length 
            ? " Bra jobbat! Du har låst upp lösningsfliken."
            : " Försök igen för att låsa upp lösningsfliken."}
        </Alert>
      )}

      <Button 
        variant="contained" 
        color="primary"
        onClick={handleSubmit}
        fullWidth
        size="large"
        sx={{ 
          mt: 4,
          mb: 6,
          py: 2,
          fontSize: '1.2rem',
          fontWeight: 'bold',
          boxShadow: 3,
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.02)',
            boxShadow: 6,
            transition: 'all 0.2s ease-in-out'
          }
        }}
      >
        {submitted ? "Försök igen" : "Kontrollera svar"}
      </Button>
    </Box>
  );
}

export default Quiz; 