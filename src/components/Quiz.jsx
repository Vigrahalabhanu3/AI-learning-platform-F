import { useState } from 'react';
import { CheckCircle, XCircle, Award } from 'lucide-react';
import './Quiz.css';

const Quiz = ({ quizzes }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return <div className="card p-4 text-center text-tertiary">No quizzes available for this topic yet.</div>;
  }

  const handleSelect = (optionIndex) => {
    if (showResults) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQIndex]: optionIndex
    });
  };

  const handleNext = () => {
    if (currentQIndex < quizzes.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizzes.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answer) {
        score++;
      }
    });
    return score;
  };

  const currentQ = quizzes[currentQIndex];
  const hasAnsweredCurrent = selectedAnswers[currentQIndex] !== undefined;

  return (
    <div className="quiz-container card">
      {!showResults ? (
        <div className="quiz-active">
          <div className="quiz-header">
            <h4>Knowledge Check</h4>
            <span className="quiz-progress">Question {currentQIndex + 1} of {quizzes.length}</span>
          </div>
          
          <div className="quiz-question">
            <h3>{currentQ.question}</h3>
          </div>

          <div className="quiz-options">
            {currentQ.options.map((opt, idx) => (
              <button 
                key={idx} 
                className={`quiz-option ${selectedAnswers[currentQIndex] === idx ? 'selected' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <div className="option-marker">{String.fromCharCode(65 + idx)}</div>
                <div className="option-text">{opt}</div>
              </button>
            ))}
          </div>

          <div className="quiz-footer">
            <button 
              className="btn-primary" 
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
            >
              {currentQIndex < quizzes.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        </div>
      ) : (
        <div className="quiz-results">
          <Award size={64} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
          <h2>Quiz Completed!</h2>
          <div className="score-display">
            You scored {calculateScore()} out of {quizzes.length}
          </div>
          
          <div className="results-breakdown">
            {quizzes.map((q, idx) => (
              <div key={idx} className="result-item">
                <div className="result-q">
                  {selectedAnswers[idx] === q.answer ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : (
                    <XCircle size={20} className="text-danger" />
                  )}
                  <span>{q.question}</span>
                </div>
                {selectedAnswers[idx] !== q.answer && (
                  <div className="result-correction">
                    Correct answer: <strong>{q.options[q.answer]}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="btn-secondary" onClick={() => {
            setShowResults(false);
            setCurrentQIndex(0);
            setSelectedAnswers({});
          }}>Retake Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
